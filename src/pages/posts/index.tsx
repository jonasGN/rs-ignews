import Head from "next/head";
import { PostTile } from "../../components/PostTile";

import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.postList}>
          <PostTile
            time="12 de março de 2021"
            title="Creating a Monorepo with Lerna & Yarn Workspaces"
            content="In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process."
          />
          <PostTile
            time="12 de março de 2021"
            title="Creating a Monorepo with Lerna & Yarn Workspaces"
            content="In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process."
          />
          <PostTile
            time="12 de março de 2021"
            title="Creating a Monorepo with Lerna & Yarn Workspaces"
            content="In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process."
          />
          <PostTile
            time="12 de março de 2021"
            title="Creating a Monorepo with Lerna & Yarn Workspaces"
            content="In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process."
          />
          <PostTile
            time="12 de março de 2021"
            title="Creating a Monorepo with Lerna & Yarn Workspaces"
            content="In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process."
          />
        </div>
      </main>
    </>
  );
}
