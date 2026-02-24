"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
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

      let remote: { message?: string } | undefined = undefined;
      if (typeof res === "object" && res !== null && "data" in res) {
        remote = (res as { data?: { message?: string } })?.data;
      }
      
      const message = (remote?.message && "Account created successfully") ?? "Account created successfully";
      showToast(message, "success");

      // After successful signup, sign in the user via NextAuth (credentials)
      const signin = (await signIn("credentials", {
        redirect: false,
        email,
        password,
      })) as SignInResponse | undefined;

      if (signin && signin.error) {
        setError(signin.error || "Sign in failed");
        setLoading(false);
        router.push("/user/login");
        return;
      } 

      // Redirect to chats page after successful sign in
      router.push("/chats");

    } 
    catch (err: unknown) {
      let remote: { error?: string } | undefined = undefined;

      if (typeof err === "object" && err !== null && "response" in err) {
        remote = (err as { response?: { data?: { error?: string } } }).response?.data;
      }

      const message = remote?.error;

      if(message){
        setError(message);
      }
      else{
        showToast("An unexpected error occurred", "error");
      }

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

         <div className="my-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-zinc-700" />
          <div className="text-sm text-zinc-500">or</div>
          <div className="h-px flex-1 bg-zinc-700" />
        </div>

        <button type="button" onClick={handleGoogleLogin} className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700">
          Login with Google
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

      {toast && (
        <div className="fixed top-6 z-50 flex justify-center">
          <div
            className={
              "max-w-sm rounded-md px-4 py-2 shadow-lg " +
              (toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white")
            }
          >
            {toast.message}
          </div>
        </div>
      )}

    </div>
  );
}