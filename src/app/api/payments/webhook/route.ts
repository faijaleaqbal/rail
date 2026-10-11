import { ok, fail } from "@/lib/api";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return fail(400, "MISSING_SIGNATURE", "stripe-signature header is required");
    }

    const body = await request.text();

    // In production: verify webhook signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    // Parse event from body (stub)
    let event: { type: string; data?: { object?: Record<string, unknown> } };
    try {
      event = JSON.parse(body);
    } catch {
      return fail(400, "INVALID_JSON", "Request body is not valid JSON");
    }

    // Idempotency: check if event already processed
    const eventId = (event.data?.object as Record<string, unknown>)?.id as string | undefined;
    if (eventId) {
      const existing = await query(
        "SELECT id FROM stripe_events WHERE id = $1",
        [eventId]
      );
      if (existing.length > 0) {
        return ok({ received: true, duplicate: true });
      }
    }

    // Store event
    if (eventId) {
      await query(
        "INSERT INTO stripe_events (id, type, data, created_at) VALUES ($1, $2, $3, now())",
        [eventId, event.type, JSON.stringify(event.data?.object ?? {})]
      );
    }

    // Handle event types
    switch (event.type) {
      case "checkout.session.completed":
        // Update user subscription in database
        break;
      case "customer.subscription.updated":
        // Sync subscription status
        break;
      case "customer.subscription.deleted":
        // Mark subscription as canceled
        break;
      case "invoice.payment_failed":
        // Notify user about failed payment
        break;
    }

    return ok({ received: true });
  } catch (error) {
    console.error("POST /api/payments/webhook failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong processing webhook.");
  }
}
