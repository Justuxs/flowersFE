import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import endpoints from "@/pages/api/endpoints/endpoints";

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;

        const response = await fetch(endpoints.login, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password: password }),
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        return {
          email: email,
          password: password,
        };
      },
    }),
  ],
});