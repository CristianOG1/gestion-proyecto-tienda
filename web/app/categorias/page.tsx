import Link from "next/link";
import { getCategories } from "@/lib/get-categories";
import { getImageUrl } from "@/lib/image-url";
import { HeroCategorias } from "@/components/HeroCategorias";

export const dynamic = "force-dynamic";
export const metadata = {
    title: "Categorías | MiTienda",
    description: "Explora todas nuestras categorías de productos.",
};

export default async function CategoriasPage() {
    const categories = await getCategories();

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <HeroCategorias totalCategorias={categories.length} />

            <section className="mx-auto max-w-7xl px-4 py-10 md:py-14 2xl:px-0">
                {categories.length === 0 ? (
                    <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No hay categorías disponibles
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Vuelve pronto o regresa a la página principal.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => {
                            const image = getImageUrl(category.image);
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/categories/${category.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={category.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400">Sin imagen</span>
                                        )}
                                    </div>
                                    <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </h2>
                                    {category.description ? (
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                            {category.description}
                                        </p>
                                    ) : null}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
