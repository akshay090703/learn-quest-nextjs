import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { buffer } from "micro";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export const config = {
  api: {
    bodyParser: false,
  },
};

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  try {
    const body = wh.verify(payload, headers);
    console.log(body);

    const { type, data } = body;

    if (type === "user.created") {
      await db.insert(users).values({
        name: data.first_name + " " + data.last_name || "Unknown",
        email: data.email_addresses[0].email_address,
        clerkUserId: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });

      console.log("User created: ", data.email_addresses[0].email_address);
    } else if (type === "user.updated") {
      await db
        .update(users)
        .set({
          name: data.first_name + " " + data.last_name || "Unknown",
          email: data.email_addresses[0].email_address,
          updatedAt: data.updated_at,
        })
        .where(eq(users.clerkUserId, data.id));

      console.log("🔄 User updated:", data.email_addresses[0].email_address);
    } else if (type === "user.deleted") {
      await db.delete(users).where(eq(users.clerkUserId, data.id));

      console.log("❌ User deleted:", data.id);
    }
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
