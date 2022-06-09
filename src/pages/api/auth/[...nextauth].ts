import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

const env = process.env;

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const matcher = q.Match(q.Index("user_by_email"), q.Casefold(user.email));
      const data = { name: user.name, email: user.email };

      try {
        await fauna.query(
          q.If(
            q.Not(q.Exists(matcher)),
            q.Create(q.Collection("users"), { data }),
            q.Get(matcher)
          )
        );
        return true;
      } catch (error) {
        return false;
      }
    },
  },
});
