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
                <div className="mb-4 mt-6 grid grid-cols-1 gap-4 text-center sm:mt-8 sm:grid-cols-2 lg:mb-0 lg:grid-cols-4 xl:gap-8">
                    {
                        categories.map((category, index) => (
                            <Link href={`/categories/${category.slug}`} key={index} className="grid place-content-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <img src={category.image} alt={category.name} className="mx-auto aspect-square w-full h-auto object-cover text-gray-400 dark:hover:bg-gray-500" />
                                <p className="text-lg mt-6 font-semibold text-gray-900 dark:text-white">{category.name}</p>
                                <small>{category.description}</small>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}