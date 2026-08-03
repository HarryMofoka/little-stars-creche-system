"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthSplit, authField } from "@/components/site/AuthSplit";
import { useAuth } from "@/lib/auth";
import childPortrait from "@/assets/auth-child-portrait.jpg";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bgImgSrc = typeof childPortrait === "string" ? childPortrait : childPortrait.src;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = signUp({ name, email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    toast.success("Account created — let's get you set up");
    router.push("/onboarding");
  }

  return (
    <AuthSplit
      image={bgImgSrc}
      imageAlt="A smiling preschooler looking at the camera"
      quote="Tell us about your little one, and we'll shape their days around who they already are."
    >
      <form onSubmit={submit} className="dash-card space-y-4 p-8">
        <div>
          <p className="eyebrow text-muted-foreground">Parent account</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Six quick questions after this and your family space is ready.
          </p>
        </div>

        <label className="block text-sm font-medium">
          Your full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className={authField}
          />
        </label>

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
            autoComplete="new-password"
            className={authField}
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Create account
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already with us?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthSplit>
  );
}
