import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const { amount, userId, typeOfPlan } = await req.json();

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    notes: {
      userId,
      typeOfPlan,
    },
  });

  return NextResponse.json(order);
}
