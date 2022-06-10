import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stipe-js";

import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data } = useSession();

  async function subscribe() {
    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripeJs = await getStripeJs();
      stripeJs.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  }

  function handleSubscribe() {
    data ? subscribe() : signIn("github");
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
