import Head from "next/head";
import { GetStaticProps } from "next";
import { asText } from "@prismicio/helpers";
import { PostTile } from "../../components/PostTile";
import { getPrismicClient } from "../../services/prismic";

import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.postList}>
          {posts.map((post) => (
            <PostTile
              key={post.slug}
              time={post.updatedAt}
              title={post.title}
              content={post.excerpt}
            />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();

  // fetch posts
  const response = await client.get({
    pageSize: 100,
    fetch: ["post.title", "post.content"],
  });

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      excerpt: post.data.content.find((c) => c.type === "paragraph")?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return {
    props: { posts },
  };
};
