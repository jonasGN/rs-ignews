import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    const session = await getSession({ req: request });
    const stripeCustomer = await stripe.customers.create({
      name: session.user.name,
      email: session.user.email,
    });

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      line_items: [{ price: "price_1L32vrCCkV4u3C5q75W69wlg", quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      cancel_url: process.env.STRIPE_CANCEL_URL,
      success_url: process.env.STRIPE_SUCCESS_URL,
    });

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
}

export default handler;
