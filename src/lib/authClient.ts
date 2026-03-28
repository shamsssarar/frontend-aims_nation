import { createAuthClient } from "better-auth/react"; // Make sure to import from /react!

// Initialize the client
export const authClient = createAuthClient({
  // This must point to your backend URL (e.g., http://localhost:5000)
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`,
});

// Destructure the incredibly useful hooks so you can use them easily in your pages
export const {
  signIn,
  signUp,
  signOut,
  useSession, // The most important hook for checking if someone is logged in
} = authClient;
