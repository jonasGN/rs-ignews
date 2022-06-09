import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const env = process.env;

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
