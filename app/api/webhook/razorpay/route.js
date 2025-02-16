import { db } from "@/config/db";
import { payments, subscriptions, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!RAZORPAY_WEBHOOK_SECRET) {
  console.error("❌ RAZORPAY_WEB_SECRET environment variable is not set.");
}

function getEndTime(plan) {
  const now = new Date();
  const daysInMonth = 30;
  const daysInYear = 365;

  let endTime;
  if (plan === "monthly") {
    endTime = new Date(now.getTime() + daysInMonth * 24 * 60 * 60 * 1000);
  } else {
    endTime = new Date(now.getTime() + daysInYear * 24 * 60 * 60 * 1000);
  }

  return endTime;
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
    const { event: eventType, payload } = event;
    const paymentEntity = payload.payment.entity;
    const {
      id,
      order_id,
      amount,
      status,
      notes,
      error_code,
      error_description,
    } = paymentEntity;

    const clerkUserId = notes?.userId;
    const planType = notes?.typeOfPlan;

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

    const userId = user[0].id;

    if (eventType === "payment.captured") {
      await db.insert(payments).values({
        id,
        userId,
        orderId: order_id,
        amount: amount / 100, // Convert paise to INR
        status,
      });

      const existingSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (existingSubscription.length > 0) {
        const newEndTime = new Date(existingSubscription[0].endDate);
        const extensionTime = getEndTime(planType);

        if (existingSubscription[0].status === "active") {
          newEndTime.setTime(newEndTime.getTime() + extensionTime);

          await db
            .update(subscriptions)
            .set({ endDate: newEndTime })
            .where(eq(subscriptions.userId, userId));

          console.log(`🔄 Subscription extended for user: ${clerkUserId}`);
        } else if (existingSubscription[0].status === "expired") {
          await db
            .update(subscriptions)
            .set({
              startDate: new Date(),
              endDate: new Date() + extensionTime,
            })
            .where(eq(subscriptions.userId, userId));

          console.log(`🔄 Subscription restarted for user: ${clerkUserId}`);
        }
      } else {
        await db.insert(subscriptions).values({
          userId,
          razorpaySubscriptionId: id,
          type: planType,
          startDate: new Date(),
          endDate: getEndTime(planType),
          status: "active",
        });

        console.log(`✅ New subscription created for user: ${clerkUserId}`);
      }

      return NextResponse.json(
        { message: "Payment successful" },
        { status: 200 }
      );
    } else if (eventType === "payment.failed") {
      // ⚠️ Transaction for failed payment
      await db.insert(payments).values({
        id,
        userId,
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
