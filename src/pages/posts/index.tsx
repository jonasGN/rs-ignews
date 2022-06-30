import Head from "next/head";
import { GetStaticProps } from "next";
import { asText } from "@prismicio/helpers";
import { PostTile } from "../../components/PostTile";
import { getPrismicClient } from "../../services/prismic";
import { toLocaleDate } from "../../utils/formatters";

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
      excerpt: formatExcerpt(post.data.content),
      updatedAt: toLocaleDate(post.last_publication_date),
    };
  });

  return {
    props: { posts },
  };
};

function formatExcerpt(content): string {
  return (
    content.find((c) => c.type === "paragraph")?.text.substring(0, 260) + "..." ?? ""
  );
}
