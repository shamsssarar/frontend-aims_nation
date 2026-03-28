"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/authClient"; // Your better-auth client
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // The better-auth magic function
    const { data, error: authError } = await signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Invalid email or password.");
      setIsLoading(false);
      return;
    }

    // Success! The middleware will catch them and route them appropriately
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader className="space-y-1 text-center">
            {/* You can replace this H1 with an actual <img src="/logo.png" /> later */}
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">
              AIMS Nation
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="bruce@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-visible:ring-secondary" // Touches of the gold!
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-secondary font-semibold hover:underline"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
