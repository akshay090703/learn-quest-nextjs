import { db } from "@/config/db";
import { subscriptions, users } from "@/config/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkUserId = searchParams.get("userId");

    if (!clerkUserId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get user ID from Clerk user ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user[0].id;
    const currentTime = new Date();

    // Fetch the latest subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    if (subscription.length === 0) {
      return NextResponse.json(
        { isActive: false, status: "No Subscription" },
        { status: 200 }
      );
    }

    const sub = subscription[0];

    if (new Date(sub.endDate) > currentTime) {
      return NextResponse.json(
        { isActive: true, status: sub.status },
        { status: 200 }
      );
    } else {
      // If expired, update the status
      await db
        .update(subscriptions)
        .set({ status: "expired" })
        .where(eq(subscriptions.id, sub.id));

      return NextResponse.json(
        { isActive: false, status: "expired" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("❌ Subscription Status Check Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
