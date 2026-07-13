import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user!.id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(product.calculatedPrice) * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.calculatedPrice,
        weight: product.weight,
        total: itemTotal,
      });
    }

    // Add shipping
    const shipping = total >= 5000 ? 0 : 150;
    const tax = Math.round(total * 0.2);
    const finalTotal = total + shipping + tax;

    // Create or find shipping address
    let addressId: string | undefined;

    if (shippingAddress) {
      const address = await db.address.create({
        data: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address1: shippingAddress.address,
          city: shippingAddress.city,
          country: shippingAddress.country || "Morocco",
          postalCode: shippingAddress.postalCode || "00000",
          phone: shippingAddress.phone || "",
          userId: session.user!.id,
        },
      });
      addressId = address.id;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user!.id,
        subtotal: total,
        shippingCost: shipping,
        tax,
        total: finalTotal,
        currency: "MAD",
        status: "PENDING",
        shippingAddressId: addressId,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
