"use client";

import { login } from "@/actions/authActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-gray-400";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login({ username, password });

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.push("/me");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      {error && (
        <p
          data-testid="login-error"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Benutzername
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="dein-benutzername"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Passwort
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </label>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Passwort vergessen?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
      >
        {loading ? "Anmeldung..." : "Anmelden"}
      </button>
    </form>
  );
}
