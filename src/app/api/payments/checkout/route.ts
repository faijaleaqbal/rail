import { ok, fail, parseBody } from "@/lib/api";
import { z } from "zod";

const checkoutSchema = z.object({
  price_id: z.string().min(1, "price_id is required"),
});

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, checkoutSchema);
    if ("response" in parsed) return parsed.response;

    const { price_id } = parsed.data;

    // In production: create Stripe Checkout Session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   mode: "subscription",
    //   line_items: [{ price: price_id, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    // });

    // Stub: return mock checkout URL
    return ok({
      checkout_url: `https://checkout.stripe.com/pay/mock_${price_id}`,
      message: "Redirect to checkout_url to complete payment",
    });
  } catch (error) {
    console.error("POST /api/payments/checkout failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong creating checkout.");
  }
}
