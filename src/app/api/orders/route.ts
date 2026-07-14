import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    const url = new URL(request.url);
    const number = url.searchParams.get("number");

    if (number) {
      const order = await db.order.findUnique({
        where: { orderNumber: number },
        select: {
          orderNumber: true,
          status: true,
          createdAt: true,
          total: true,
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({ order });
    }

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
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
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

    for (const item of items) {
      if (!item.productId || typeof item.productId !== "string" || item.productId.trim() === "") {
        return NextResponse.json(
          { error: "Each item must have a valid productId" },
          { status: 400 }
        );
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Each item must have a positive integer quantity" },
          { status: 400 }
        );
      }
    }

    // Calculate total
    let total = 0;
    const orderItems: { productId: string; quantity: number; price: any; weight: number; total: number }[] = [];

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

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    const order = await db.$transaction(async (tx) => {
      let addressId: string | undefined;

      if (shippingAddress) {
        const address = await tx.address.create({
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

      const createdOrder = await tx.order.create({
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

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
