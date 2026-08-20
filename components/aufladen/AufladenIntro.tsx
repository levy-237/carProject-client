import Link from "next/link";

export default function AufladenIntro() {
  return (
    <section className="px-4 py-12 max-md:py-8" data-testid="aufladen-intro">
      <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10">
        <h1 className="text-3xl font-semibold text-gray-900">E-Auto laden</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Beim Kauf zählt nicht nur die Reichweite auf dem Papier. Ob du
          zuhause, am Arbeitsplatz oder nur unterwegs laden kannst, macht im
          Alltag den Unterschied. Hier findest du die wichtigsten Infos — ohne
          Fachchinesisch.
        </p>
        <Link
          href="/listings"
          data-testid="aufladen-intro-link"
          className="mt-8 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-700"
        >
          Passende Fahrzeuge finden
        </Link>
      </div>
    </section>
  );
}
