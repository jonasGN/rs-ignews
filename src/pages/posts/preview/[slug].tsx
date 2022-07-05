import { asHTML, asText } from "@prismicio/helpers";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../../services/prismic";
import { toLocaleDate } from "../../../utils/formatters";

import styles from "../../../styles/pages/post.module.scss";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostPreviewProps {
  post: Post;
}

export default function Post({ post }: PostPreviewProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
            className={`${styles.content} ${styles.preview}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <Link href="/">
            <a className={styles.continueReadingButton}>
              Wanna continue reading? <span>Subscribe now 🤗</span>
            </a>
          </Link>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismaClient = getPrismicClient();
  const slug = String(params.slug);

  const response = await prismaClient.getByUID("post", slug);
  const data = response.data;

  const post: Post = {
    slug,
    title: asText(data.title),
    content: asHTML(data.content.splice(0, 2)),
    updatedAt: toLocaleDate(response.last_publication_date),
  };

  return {
    props: { post },
  };
};
