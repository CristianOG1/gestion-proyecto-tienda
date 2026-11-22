import { getCategories } from "@/lib/get-categories";
import Link from "next/link";

export const Categories = async () => {
    const categories = await getCategories()
    
    if (categories.length == 0) return null

    return (
        <section id="categories" className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-7xl px-4 2xl:px-0">
                <div className="sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Todas las categorias</p>
                </div>
                <div className="mb-4 mt-6 grid grid-cols-1 gap-6 text-center sm:mt-8 sm:grid-cols-2 lg:mb-0 lg:grid-cols-3 xl:grid-cols-4">
                    {
                        categories.map((category) => (
                            <Link
                                href={`/categories/${category.slug}`}
                                key={category.slug}
                                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : null}
                                </div>
                                <p className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{category.name}</p>
                                <small className="mt-1 text-gray-600 dark:text-gray-400">{category.description}</small>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}