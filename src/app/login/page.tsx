"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthSplit, authField } from "@/components/site/AuthSplit";
import { demoUsers, roleLabels, useAuth } from "@/lib/auth";
import childrenPlaying from "@/assets/auth-children-playing.jpg";

export default function LoginPage() {
  const { signIn, session, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bgImgSrc = typeof childrenPlaying === "string" ? childrenPlaying : childrenPlaying.src;

  useEffect(() => {
    if (ready && session) {
      router.replace(session.onboarded === false ? "/onboarding" : "/dashboard");
    }
  }, [ready, session, router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    toast.success("Signed in");
    router.push("/dashboard");
  }

  return (
    <AuthSplit
      image={bgImgSrc}
      imageAlt="Toddlers playing with wooden blocks in a sunlit Little Stars classroom"
      quote="Every morning starts with play, and every play becomes a story you can read tonight."
    >
      <form onSubmit={submit} className="dash-card space-y-4 p-8">
        <div>
          <p className="eyebrow text-muted-foreground">Learner management</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Welcome back</h1>
        </div>

        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={authField}
          />
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={authField}
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-muted-foreground">
          New to Little Stars?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>

      <div className="dash-card mt-4 p-6">
        <p className="eyebrow text-muted-foreground">Demo accounts</p>
        <ul className="mt-3 space-y-2 text-sm">
          {demoUsers.map((u) => (
            <li key={u.email} className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{roleLabels[u.role]}</span>
              <button
                type="button"
                onClick={() => {
                  setEmail(u.email);
                  setPassword(u.password);
                }}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
              >
                Use {u.email}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Password for every demo account: <span className="font-medium">little-stars</span>
        </p>
      </div>
    </AuthSplit>
  );
}
