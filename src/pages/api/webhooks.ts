import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

async function getBuffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set(["checkout.session.completed"]);

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
      console.log("Event received:", event);
    }
    response.status(200).json({ received: true });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
}

export default handler;
