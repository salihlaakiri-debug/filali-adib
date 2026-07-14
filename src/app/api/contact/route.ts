import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // Store as a notification for the admin
    await db.notification.create({
      data: {
        type: "CONTACT_FORM",
        title: `Contact: ${subject || "General"} — ${name}`,
        message: `From: ${name} (${email}${phone ? `, ${phone}` : ""})\n\n${message}`,
        isRead: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
