import Head from "next/head";
import Image from "next/image";
import { GetStaticProps } from "next";

import { stripe } from "../services/stripe";
import { toCurrency } from "../utils/formatters";
import { SubscribeButton } from "../components/SubscribeButton";

import womanPic from "/public/images/girl-coding.svg";
import styles from "../styles/pages/home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.hero}>
          <p>👏 Hey, welcome</p>
          <h1>
            News about <br /> the <span>React</span> world
          </h1>
          <p className={styles.subscribeInfo}>
            Get acess to all the publications <br />
            <span>for {toCurrency(product.amount)} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <div className={styles.detailImage}>
          <Image src={womanPic} alt="Girl coding" />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1L32vrCCkV4u3C5q75W69wlg");

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100,
  };

  return {
    props: {
      product,
    },
    revalidate: 86400, // 24 hours
  };
};
