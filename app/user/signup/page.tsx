"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if(password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      const res = await api.post("/auth/signup", { email, password, name });

      if (!res || res.status >= 400) {
        setError("Signup failed");
        setLoading(false);
        return;
      }

      // After successful signup, sign the user in via NextAuth (credentials)
      const signin = (await signIn("credentials", {
        redirect: false,
        email,
        password,
      })) as SignInResponse | undefined;

      if (signin && signin.error) {
        setError(signin.error || "Sign in failed");
        setLoading(false);
        return;
      }

      setError("Registration successful! Redirecting...");

      // Redirect to chats page after successful sign in
      setTimeout(() => {
        router.push("/chats");
      }, 4000);

    } 
    catch (err: any) {
      const remote = err?.response?.data;
      setError(remote?.error || "An unexpected error occurred");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-md bg-zinc-900 p-6 shadow-md"
      >
        <h2 className="mb-4 text-lg font-semibold text-white">Create an account</h2>

        {error && (
          <div className="mb-3 rounded bg-red-700/60 p-2 text-sm text-white">{error}</div>
        )}

        <label className="mb-2 block text-sm text-zinc-300">Name</label>
        <input
          // required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your name"
        />

        <label className="mb-2 block text-sm text-zinc-300">Email</label>
        <input
          // required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="you@example.com"
        />

        <label className="mb-2 block text-sm text-zinc-300">Password</label>
        <input
          // required
          type="password"
          value={password}
          // minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Choose a strong password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <div className="mt-3 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <a
            className="cursor-pointer text-indigo-400 hover:underline"
            onClick={() => router.push('/user/login')}
          >
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}