"use client";

import Link from "next/link";
import { useEffect } from "react";
import ErrorCard from "@/components/skeletons&&errors/ErrorCard";

export default function ListingDetailError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Failed to load listing:", error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <ErrorCard
        title="Anzeige"
        message="Anzeige konnte nicht geladen werden."
      />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Erneut versuchen
        </button>
        <Link href="/listings" className="text-sm text-gray-600 hover:underline">
          Zurück zu den Anzeigen
        </Link>
      </div>
    </main>
  );
}
