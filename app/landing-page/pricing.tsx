import { Check } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils";

const pricePackages = [
  {
    name: "Free",
    price: "$0",
    description: "Enjoy a full month free—no credit card required.",
    features: [
      "Starter Pack",
      "Unlimited Custom Exercises",
      "Unlimited Custom Workouts",
      "Unlimited Custom Programs",
      "Unlimited Reports"
    ],
    popular: false
  },
  {
    name: "Monthly",
    price: "$5",
    description:
      "Try free for 3 months. If you’re not satisfied, cancel during your trial and you won’t be charged.",
    features: [
      "Starter Pack",
      "Unlimited Custom Exercises",
      "Unlimited Custom Workouts",
      "Unlimited Custom Programs",
      "Unlimited Reports",
      "3-Month Free Trial"
    ],
    popular: true
  },
  {
    name: "Yearly",
    price: "$3/mo",
    description:
      "Save 40% with an annual plan—just $36 per year. Includes a 3-month free trial before your discounted yearly payment.",
    features: [
      "Starter Pack",
      "Unlimited Custom Exercises",
      "Unlimited Custom Workouts",
      "Unlimited Custom Programs",
      "Unlimited Reports",
      "3-Month Free Trial",
      "40% Discount"
    ],
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 lg:px-12 py-20 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Simple, transparent <span className="text-neutral-500">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Only pay once you've tried it out
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricePackages.map(pricePackage => (
            <Card key={pricePackage.name} className={cn("relative p-8", pricePackage.popular && "border-2 border-neutral-900 dark:border-neutral-500")}>
              {pricePackage.popular && (
                <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 border rounded-full px-4 py-1 text-sm font-semibold bg-card border-2 border-neutral-900 dark:border-neutral-500">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{pricePackage.name}</h2>
                <div>
                  <span className="text-4xl font-bold">{pricePackage.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{pricePackage.description}</p>
              </div>
              <ul className="mb-8 space-y-3">
                {pricePackage.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2" />{feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={pricePackage.popular ? "default" : "secondary"}>
                Get started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}