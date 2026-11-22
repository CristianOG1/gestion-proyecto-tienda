import Link from "next/link";
import { SortBy } from "@/components/SortBy";
import { Pagination } from "@/components/Pagination";
import { AddToCartButton } from "@/components/AddToCartButton";
import { HeroCategoria } from "@/components/HeroCategoria";
import { getProducts } from "@/lib/get-product";
import { getCategories } from "@/lib/get-categories";
import { getImageUrl } from "@/lib/image-url";

const formatSlug = (slug: string) =>
    decodeURIComponent(slug).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default async function CategoryPage({
    params,
    searchParams,
}: PageProps<"/categories/[categoryId]">) {
    const [{ categoryId }, query] = await Promise.all([params, searchParams]);
    const page = Math.max(1, Number.parseInt(String(query.page), 10) || 1);
    const sort = query.sort === "price" ? "price" : undefined;

    const [{ pagination, products }, categories] = await Promise.all([
        getProducts({ categoryId, page, sort: sort && "price:asc" }),
        getCategories(),
    ]);

    const currentCategory = categories.find((c) => c.slug === categoryId);
    const nombre = currentCategory?.name ?? formatSlug(categoryId);
    const totalProductos = pagination?.total ?? products.length;

    return (
        <div className="flex-1 bg-gray-50 antialiased dark:bg-gray-900">
            <HeroCategoria
                nombre={nombre}
                descripcion={currentCategory?.description}
                imagen={currentCategory?.image}
                totalProductos={totalProductos}
            />

            <section className="mx-auto max-w-7xl px-4 py-8 md:py-12 2xl:px-0">
                {products.length === 0 ? (
                    <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No se encontraron productos
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Esta categoría aún no tiene productos disponibles.
                        </p>
                        <Link
                            href="/categorias"
                            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            ← Ver todas las categorías
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Mostrando {products.length} de {totalProductos} productos
                            </p>
                            <SortBy sort={sort} />
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => {
                                const imgSrc = getImageUrl(product.image);
                                return (
                                    <div
                                        key={product.id}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-6 dark:bg-gray-700/40">
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-400">Sin imagen</span>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                                {product.name}
                                            </h2>
                                            <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ${product.price}
                                                </span>
                                                <AddToCartButton
                                                    product={{
                                                        id: product.id,
                                                        slug: product.slug,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: imgSrc ?? "",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {pagination && pagination.pageCount > 1 ? (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    page={pagination.page}
                                    pageCount={pagination.pageCount}
                                    sort={sort}
                                />
                            </div>
                        ) : null}
                    </>
                )}
            </section>
        </div>
    );
}
