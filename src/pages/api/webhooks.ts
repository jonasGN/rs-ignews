import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function getBuffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    const buffer = await getBuffer(request);
    const secretHeader = request.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOKS_SECRET;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buffer, secretHeader, secret);
    } catch (error) {
      return response.status(400).send(`Webhook error: ${error.message}`);
    }

    const { type } = event;
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "checkout.session.completed":
            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            await saveSubscription({
              customerId: checkoutSession.customer.toString(),
              subscriptionId: checkoutSession.subscription.toString(),
              createAction: true,
            });
            break;
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription({
              customerId: subscription.customer.toString(),
              subscriptionId: subscription.id,
              createAction: false,
            });
            break;
          default:
            throw new Error(`Unhandled event: ${type}`);
        }
      } catch (error) {
        return response.json({ error: `Webhook of type ${type} handler failed` });
      }
    }
    response.status(200).json({ received: true });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
}

export default handler;
