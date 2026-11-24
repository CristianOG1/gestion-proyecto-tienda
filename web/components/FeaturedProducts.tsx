import { getFeaturedProducts } from "@/lib/get-product";
import { AddToCartButton } from "@/components/AddToCartButton";

export const FeaturedProducts = async () => {
    const products = await getFeaturedProducts();

    if (products.length === 0) return null;

    return (
        <section className="bg-white py-10 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-7xl px-4 2xl:px-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    Productos destacados
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="flex aspect-square items-center justify-center bg-gray-50 p-6 dark:bg-gray-700/40">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400">Sin imagen</span>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    {product.name}
                                </h3>
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
                                            image: product.image ?? "",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};














