"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { useCartStore } from "@/lib/cart-store"

export default function PagoExitoPage() {
    const clearCart = useCartStore((state) => state.clearCart)

    useEffect(() => {
        clearCart()
    }, [clearCart])

    return (
        <section className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <CheckCircleIcon className="mx-auto h-14 w-14 text-green-600 dark:text-green-400" aria-hidden="true" />
                <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    ¡Compra exitosa!
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Gracias por tu pedido. Hemos recibido tu pago correctamente y vaciamos tu carrito.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Volver a la tienda
                </Link>
            </div>
        </section>
    )
}
