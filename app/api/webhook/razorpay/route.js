import { db } from "@/config/db";
import { payments, subscriptions, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!RAZORPAY_WEBHOOK_SECRET) {
  console.error("❌ RAZORPAY_WEB_SECRET environment variable is not set.");
}

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const isValid = Razorpay.validateWebhookSignature(
      rawBody,
      signature,
      RAZORPAY_WEBHOOK_SECRET
    );
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    // console.log("🔹 Razorpay Webhook Event:", event);

    if (event.event === "payment.captured") {
      const { id, order_id, amount, status, notes } =
        event.payload.payment.entity;
      const clerkUserId = notes?.userId;

      if (!clerkUserId) {
        console.error("❌ Missing clerkUserId in payment notes");
        return NextResponse.json(
          { error: "Missing clerkUserId" },
          { status: 400 }
        );
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1);

      if (user.length === 0) {
        console.error("❌ No user found with clerkUserId:", clerkUserId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Store successful payment in DB
      await db.insert(payments).values({
        id,
        userId: user[0].id,
        orderId: order_id,
        amount: amount / 100, // Convert paise to INR
        status,
      });

      console.log(`✅ Payment recorded for user: ${clerkUserId}`);
      return NextResponse.json(
        { message: "Payment successful" },
        { status: 200 }
      );
    } else if (event.event === "payment.failed") {
      const {
        id,
        order_id,
        amount,
        status,
        notes,
        error_code,
        error_description,
      } = event.payload.payment.entity;
      const clerkUserId = notes?.userId;

      if (!clerkUserId) {
        console.error("❌ Missing clerkUserId in payment notes");
        return NextResponse.json(
          { error: "Missing clerkUserId" },
          { status: 400 }
        );
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1);

      if (user.length === 0) {
        console.error("❌ No user found with clerkUserId:", clerkUserId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Store failed payment in DB
      await db.insert(payments).values({
        id,
        userId: user[0].id,
        orderId: order_id,
        amount: amount / 100,
        status: "failed",
        failureReason: error_description,
        errorCode: error_code,
      });

      console.log(
        `⚠️ Payment failed for Order ID: ${order_id}, Reason: ${
          error_description || "Unknown"
        }`
      );

      return NextResponse.json(
        { message: "Payment failure recorded" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (error) {
    console.error("❌ Razorpay Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
