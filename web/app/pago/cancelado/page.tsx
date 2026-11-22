import Link from "next/link"
import { XCircleIcon } from "@heroicons/react/24/outline"

export const metadata = {
    title: "Pago cancelado | MiTienda",
    description: "El proceso de pago fue cancelado.",
}

export default function PagoCanceladoPage() {
    return (
        <section className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <XCircleIcon className="mx-auto h-14 w-14 text-red-600 dark:text-red-400" aria-hidden="true" />
                <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Pago cancelado
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    No se realizó ningún cargo. Tus productos siguen guardados en el carrito.
                </p>
                <Link
                    href="/cart"
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    Volver al carrito
                </Link>
            </div>
        </section>
    )
}
