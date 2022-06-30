import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

type Subscription = {
  subscriptionId: string;
  customerId: string;
  createAction: boolean;
};

export async function saveSubscription(subscription: Subscription) {
  const { customerId, subscriptionId, createAction = false } = subscription;

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

  if (createAction) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    );
    return;
  }

  await fauna.query(
    q.Replace(
      q.Select("ref", q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))),
      { data: subscriptionData }
    )
  );
}
