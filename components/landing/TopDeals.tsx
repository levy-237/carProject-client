import Link from "next/link";
import Carousel from "@/components/ui/Carousel";
import { fetchTopDeals } from "@/lib/listings";

export default async function TopDeals() {
  let response;
  try {
    response = await fetchTopDeals();
  } catch (error) {
    console.log("failed to fetch top deals");
    return null;
  }

  if (response.results.length === 0) return null;

  return (
    <section className="px-4 py-8 pb-12">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-6 text-xl font-semibold">Top Deals</h2>

        <Carousel className="min-h-[22rem] pb-10" itemsPerSlide={2}>
          {response.results.map((deal) => (
            <Link
              key={deal.id}
              href={`/listings/${deal.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={deal.cover_image?.image ?? "/placeholder.png"}
                  alt={deal.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {deal.price}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {deal.model_detail.name}
                </p>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
