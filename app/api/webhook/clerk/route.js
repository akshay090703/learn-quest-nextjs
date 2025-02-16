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

function getName(firstName, lastName) {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }

  return "Unknown";
}

export async function POST(req) {
  try {
    const svix_id = req.headers.get("svix-id") ?? "";
    const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
    const svix_signature = req.headers.get("svix-signature") ?? "";

    const resBody = await req.text();

    const sivx = new Webhook(CLERK_WEBHOOK_SECRET);

    const body = sivx.verify(resBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    const { type, data } = body;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, data.id));

    if (type === "user.created") {
      if (user.length > 0) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      await db.insert(users).values({
        name: getName(data.first_name, data.last_name),
        email: data.email_addresses[0].email_address,
        clerkUserId: data.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      });

      console.log("✅ User created:", data.email_addresses[0].email_address);
    } else if (type === "user.updated") {
      if (user.length == 0) {
        return NextResponse.json(
          { message: "User does not exist" },
          { status: 404 }
        );
      }

      await db
        .update(users)
        .set({
          name: getName(data.first_name, data.last_name),
          email: data.email_addresses[0].email_address,
          updatedAt: new Date(data.updated_at),
        })
        .where(eq(users.clerkUserId, data.id));

      console.log("🔄 User updated:", data.email_addresses[0].email_address);
    } else if (type === "user.deleted") {
      if (user.length == 0) {
        return NextResponse.json(
          { message: "User does not exist" },
          { status: 404 }
        );
      }

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
