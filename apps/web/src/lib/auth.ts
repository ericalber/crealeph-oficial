import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const DEV_BYPASS_EMAIL = "pr.erickalberto@hotmail.com";
const DEV_BYPASS_PASSWORD = "crealephtest";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-crealeph",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email ?? "").trim().toLowerCase();
        const password = (credentials?.password ?? "").trim();
        const devEmail = DEV_BYPASS_EMAIL.toLowerCase();
        if (email === devEmail && password === DEV_BYPASS_PASSWORD) {
          return {
            id: "dev-user",
            email: DEV_BYPASS_EMAIL,
            name: "Eric (DEV MODE)",
            role: "viewer",
            devMode: true,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "GOOGLE_CLIENT_ID_PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "GOOGLE_CLIENT_SECRET_PLACEHOLDER",
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (typeof user.id === "string") {
          token.id = user.id;
        }
        if ("role" in user && typeof user.role === "string") {
          token.role = user.role;
        }
        if ("devMode" in user && typeof user.devMode === "boolean") {
          token.devMode = user.devMode;
        } else {
          token.devMode = false;
        }
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }
        if (typeof token.role === "string") {
          session.user.role = token.role;
        }
        if (typeof token.devMode === "boolean") {
          session.user.devMode = token.devMode;
        }
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.includes("/app")) return url;
      return `${baseUrl}/app`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
