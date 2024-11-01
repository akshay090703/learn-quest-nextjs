"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

export default function UpgradePage() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "Rs. 0",
      features: [
        "Create up to 5 courses",
        "Basic course customization",
        "Email support",
      ],
      buttonText: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro",
      price: annualBilling ? "Rs. 960/year" : "Rs. 100/month",
      features: [
        "Unlimited course creation",
        "Advanced customization options",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
      disabled: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Upgrade Your Plan</h1>
      <div className="flex justify-center items-center mb-8">
        <span className="mr-3 text-sm font-medium">Monthly Billing</span>
        <Switch
          checked={annualBilling}
          onCheckedChange={setAnnualBilling}
          className="bg-primary"
        />
        <span className="ml-3 text-sm font-medium">
          Annual Billing (Save 20%)
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`bg-white shadow-lg dark:bg-card dark:text-card-foreground`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-3xl font-semibold">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.disabled
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary-light"
                }`}
                disabled={plan.disabled}
                onClick={() =>
                  toast.error(
                    <h1>This feature is currently under development!</h1>
                  )
                }
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
