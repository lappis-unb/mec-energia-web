import { SignInResponsePayload } from "@/types/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const signInUrl = `${apiUrl}/token/`;

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      id: "credentials",
      name: "CredentialsProvider",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const response = await fetch(signInUrl, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok || !response) {
          return null;
        }

        const {
          user: { email, id, firstName, lastName, type, universityId },
          token,
        }: SignInResponsePayload = await response.json();

        return {
          id,
          firstName,
          lastName,
          email,
          type,
          token,
          universityId,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.universityId = user.universityId;
        token.type = user.type;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.token = token.token;
        session.user.universityId = token.universityId;
        session.user.type = token.type;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
