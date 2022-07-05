import { asHTML, asText } from "@prismicio/helpers";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";
import { toLocaleDate } from "../../utils/formatters";

import styles from "../../styles/pages/post.module.scss";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.content}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  const prismaClient = getPrismicClient();
  const slug = String(params.slug);

  const response = await prismaClient.getByUID("post", slug);
  const data = response.data;

  const post: Post = {
    slug,
    title: asText(data.title),
    content: asHTML(data.content),
    updatedAt: toLocaleDate(response.last_publication_date),
  };

  return {
    props: { post },
  };
};
