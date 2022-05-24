import Head from "next/head";
import Image from "next/image";

import { SubscribeButton } from "../components/SubscribeButton";

import womanPic from "/public/images/girl-coding.svg";
import styles from "../styles/pages/home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.hero}>
          <p>👏 Hey, Welcome</p>
          <h1>
            News about <br /> the <span>React</span> world
          </h1>
          <p className={styles.subscribeInfo}>
            Get acess to all the publications <br />
            <span>for $9.90 month</span>
          </p>
          <SubscribeButton />
        </section>
        <div className={styles.detailImage}>
          <Image src={womanPic} alt="Girl coding" />
        </div>
      </main>
    </>
  );
}
