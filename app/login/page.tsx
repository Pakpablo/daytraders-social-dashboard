"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(params.get("from") ?? "/overview");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Invalid username or password.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-[#151517] border border-white/10 rounded-2xl p-8"
    >
      <h1 className="text-xl font-extrabold mb-1">DayTraders Social Dashboard</h1>
      <p className="text-gray-400 text-sm mb-6">Sign in to continue</p>

      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
        Username
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoFocus
        required
        className="w-full mb-4 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-[#D42B3F]"
      />

      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-[#D42B3F]"
      />

      {error && (
        <div className="mb-4 text-xs text-[#ff6b78] bg-[#D42B3F]/10 border border-[#D42B3F]/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D42B3F] hover:bg-[#b8202f] disabled:opacity-50 text-white font-bold text-sm rounded-lg py-2.5 transition-colors"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-[10px] text-gray-600 mt-4 text-center">
        Access is logged (name, IP, time) for security.
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
