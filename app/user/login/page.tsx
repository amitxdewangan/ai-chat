"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);
  const searchParams = useSearchParams();

  function showToast(message: string, type: "error" | "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if(password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const signin = (await signIn("credentials", {
        redirect: false,
        email,
        password,
      })) as SignInResponse | undefined;

      console.log("Login response:", signin);

      if (signin && signin.error) {
        setError(signin.error || "Login failed");
        setLoading(false);
        return;
      }

      showToast("Logged in successfully", "success");

      setTimeout(() => {
        router.push("/chats");
      }, 4000);
    } 
    catch (err) {
      console.error(err);
      showToast("An unexpected error occurred while logging in", "error");
    } 
    finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("google");
      console.log("Google sign-in result:", result);
      
      if(searchParams.get("error")){
        setError("Google sign-in error");
        return;
      }
      
      // check the result object for error property and handle it
      if(result && result.error){
        setError("Google sign-in error");
        setLoading(false);
        return;
      }

      router.push("/chats");
    } 
    catch (err) {
      console.error("hello error", err);
      showToast("Google sign-in error", "error");
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md bg-zinc-900 p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-white">Login</h2>

        {error && <div className="mb-3 rounded bg-red-700/60 p-2 text-sm text-white">{error}</div>}

        <label className="mb-2 block text-sm text-zinc-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="you@example.com"
          // required
        />

        <label className="mb-2 block text-sm text-zinc-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your password"
          // required
          // minLength={6}
        />

        <button type="submit" disabled={loading} className="w-full rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="my-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-zinc-700" />
          <div className="text-sm text-zinc-500">or</div>
          <div className="h-px flex-1 bg-zinc-700" />
        </div>

        <button type="button" onClick={handleGoogleLogin} className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700">
          Login with Google
        </button>

        <div className="mt-3 text-center text-sm text-zinc-400">
          New here?{' '}
          <a className="cursor-pointer text-indigo-400 hover:underline" onClick={() => router.push('/user/signup')}>
            Create account
          </a>
        </div>
      </form>

      {toast && (
        <div className="fixed top-6 z-50 flex justify-center">
          <div className={"max-w-sm rounded-md px-4 py-2 shadow-lg " + (toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white")}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
