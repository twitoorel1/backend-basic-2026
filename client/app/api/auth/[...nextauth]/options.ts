import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.API_URL}/auth/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
            },
            { timeout: 5000 }
          );
          const data = res.data;

          // console.log("data next auth:");
          // console.log(data);

          if (res.status === 200 && data.user) {
            return {
              id: data.user.id,
              first_name: data.user.first_name,
              last_name: data.user.last_name,
              username: data.user.username,
              email: data.user.email,
              role: data.user.role,
              last_connected: data.user.last_connected,
              ac_token: data.ac_token,
              rf_token: data.rf_token,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Login error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60, // שעה אחת
    updateAge: 60 * 60, // עידכון כל שעה
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        return {
          ...token,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          role: user.role,
          last_connected: user.last_connected,
          ac_token: user.ac_token,
          rf_token: user.rf_token,
          expires: Date.now() + 60 * 60 * 1000, // Set expiration time (60 minutes)
        };
      }

      if (token.expires && Date.now() < token.expires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id as string,
        first_name: token.first_name as string | null,
        last_name: token.last_name as string | null,
        username: token.username as string | null,
        email: token.email as string | null,
        role: token.role as string | null,
        last_connected: token.last_connected as string | null,
      };

      session.ac_token = token.ac_token as string | null;
      session.rf_token = token.rf_token as string | null;
      session.error = token.error as string | null;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signOut({ token }: any) {
      try {
        await axios.post(`${process.env.API_URL}/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token.ac_token}`,
          },
          timeout: 5000,
        });
      } catch (error: any) {
        console.error("Logout NextAuth failed:");
        console.log(error.response?.data || error.message);
      }
    },
  },
};

// Function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    console.log("test refresh token");
    console.log("body token:", token);
    console.log("Attempting to refresh token:", token.rf_token);

    const response = await axios.post(
      `${process.env.API_URL}/auth/refresh-token`,
      {
        refreshToken: token.rf_token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    console.log("Refresh response:", response.data);

    const refreshed = response.data;

    return {
      ...token,
      ac_token: refreshed.ac_token,
      rf_token: refreshed.rf_token ?? token.rf_token,
      expires: Date.now() + 60 * 60 * 1000, // Set new expiration time (60 minutes)
    };
  } catch (error: any) {
    // console.error("Status:", error.response?.status);
    // console.error("Error refreshing access token:", error);
    // console.error("Refresh token failed:", error.response?.data || error.message);
    console.log("Refresh error details:", error.response?.data);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
