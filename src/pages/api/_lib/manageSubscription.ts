import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

type Subscription = { subscriptionId: string; customerId: string };

export async function saveSubscription(subscription: Subscription) {
  const { customerId, subscriptionId } = subscription;

  const userRef = await fauna.query(
    q.Select("ref", q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId)))
  );

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const subscriptionData = {
    id: sub.id,
    userId: userRef,
    status: sub.status,
    priceId: sub.items.data[0].price.id,
  };

  await fauna.query(
    q.Create(q.Collection("subscriptions"), { data: subscriptionData })
  );
}
