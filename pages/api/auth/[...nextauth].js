import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import endpoints from "@/pages/api/endpoints/endpoints";

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      return token;
    },
    async session({ session, token }) {
      session.jwtToken = token;

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

        const jwtToken = await response.text();

        return {
          email: jwtToken,
        };
      },
    }),
  ],
});
