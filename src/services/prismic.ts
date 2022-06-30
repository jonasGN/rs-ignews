import { createClient } from "@prismicio/client";

const { env } = process;

export function getPrismicClient() {
  const client = createClient(env.PRISMIC_ENDPOINT, {
    accessToken: env.PRISMIC_ACCESS_TOKEN,
  });
  return client;
}
