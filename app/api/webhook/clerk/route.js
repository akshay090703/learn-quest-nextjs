import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { buffer } from "micro";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  console.error("❌ CLERK_WEBHOOK_SECRET is undefined");
}

export async function POST(req) {
  try {
    const { body } = await req.json();

    console.log("🔹 Webhook received:", body);

    const { type, data } = body;

    if (type === "user.created") {
      await db.insert(users).values({
        name:
          data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : "Unknown",
        email: data.email_addresses[0].email_address,
        clerkUserId: data.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      });

      console.log("✅ User created:", data.email_addresses[0].email_address);
    } else if (type === "user.updated") {
      await db
        .update(users)
        .set({
          name:
            data.first_name && data.last_name
              ? `${data.first_name} ${data.last_name}`
              : "Unknown",
          email: data.email_addresses[0].email_address,
          updatedAt: new Date(data.updated_at),
        })
        .where(eq(users.clerkUserId, data.id));

      console.log("🔄 User updated:", data.email_addresses[0].email_address);
    } else if (type === "user.deleted") {
      await db.delete(users).where(eq(users.clerkUserId, data.id));

      console.log("❌ User deleted:", data.id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
