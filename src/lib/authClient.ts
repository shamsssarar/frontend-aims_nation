import { createAuthClient } from "better-auth/react"; // Make sure to import from /react!
// Import your auth types
// Initialize the client

type OriginalSessionReturn = ReturnType<typeof authClient.useSession>;

// 2. Intersect (merge) it with your custom role
type SessionWithRole = OriginalSessionReturn & {
  data: {
    user: {
      role: "STUDENT" | "TEACHER" | "ADMIN";
    };
  } | null;
};
export const authClient = createAuthClient({
  // This must point to your backend URL (e.g., http://localhost:5000)
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
});

// Destructure the incredibly useful hooks so you can use them easily in your pages
export const {
  signIn,
  signUp,
  signOut,
  useSession = authClient.useSession as unknown as (
    options?: any,
  ) => SessionWithRole, // The most important hook for checking if someone is logged in
} = authClient;
