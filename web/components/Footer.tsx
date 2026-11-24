import Link from "next/link";
import { getCategories } from "@/lib/get-categories";

export async function Footer() {
    const categories = await getCategories();

    return (
        <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 py-12 2xl:px-0">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                            MiTienda
                        </Link>
                        <p className="mt-2 max-w-xs text-sm text-gray-600 dark:text-gray-400">
                            Catálogo en línea impulsado por Next.js y Strapi.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                            Categorías
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        href={`/categories/${category.slug}`}
                                        className="transition hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                            Tienda
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>
                                <Link href="/" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                                    Carrito de compras
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    © {new Date().getFullYear()} MiTienda · Proyecto Web — Equipo de Ingeniería.
                </div>
            </div>
        </footer>
    );
}



