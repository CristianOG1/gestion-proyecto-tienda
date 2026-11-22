import Link from "next/link";
import { getHomeInfo } from "@/lib/get-home-into";
import { getCategories } from "@/lib/get-categories";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export const Hero = async () => {
    const [{ title, description, image }, categories] = await Promise.all([
        getHomeInfo(),
        getCategories(),
    ]);
    const firstCategory = categories[0];

    return (
        <section className="relative overflow-hidden bg-gray-900">
            {image ? (
                <img
                    src={image}
                    alt=""
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28">
                <div className="max-w-2xl">
                    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
                        {title}
                    </h1>

                    <div className="mb-8 max-w-xl font-light text-gray-200 md:text-lg lg:text-xl [&>p>strong]:font-bold">
                        {Array.isArray(description) ? (
                            <BlocksRenderer content={description} />
                        ) : (
                            <p>{description}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={firstCategory ? `/categories/${firstCategory.slug}` : "#categories"}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            {firstCategory ? `Ver ${firstCategory.name}` : "Ver categorías"}
                            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>
                        </Link>
                        {firstCategory ? (
                            <a
                                href="#categories"
                                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                Ver categorías
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};