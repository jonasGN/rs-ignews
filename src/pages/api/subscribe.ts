import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    const session = await getSession({ req: request });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let stripeCustomerId = user.data.stripe_customer_id;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        name: session.user.name,
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: { stripe_customer_id: stripeCustomer.id },
        })
      );

      stripeCustomerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
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
