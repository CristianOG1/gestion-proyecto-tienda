import Link from "next/link";

export function HeroCategorias({ totalCategorias }: { totalCategorias: number }) {
    return (
        <section className="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-blue-50/70 to-white dark:border-gray-800 dark:from-gray-900 dark:via-blue-950/50 dark:to-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 2xl:px-0">
                <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                        Inicio
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span className="font-medium text-gray-900 dark:text-white">Categorías</span>
                </nav>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Explora nuestras categorías
                    </h1>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                        {totalCategorias} {totalCategorias === 1 ? "categoría" : "categorías"}
                    </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                    Descubre cada colección y encuentra los productos que buscas.
                </p>
            </div>
        </section>
    );
}
