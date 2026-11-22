"use client"

import { FormEvent, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { getImageUrl } from "@/lib/image-url"

const FREE_SHIPPING_MIN = 999
const emptySubscribe = () => () => {}

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore()
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

    const [shipping, setShipping] = useState<"standard" | "express">("standard")
    const [couponInput, setCouponInput] = useState("")
    const [couponStatus, setCouponStatus] = useState<"idle" | "applied" | "invalid">("idle")
    const [loading, setLoading] = useState(false)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    if (!mounted) {
        return <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4" />
    }

    if (items.length === 0) {
        return (
            <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
                <div className="mx-auto max-w-xl rounded-2xl bg-white dark:bg-gray-800 p-10 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tu carrito está vacío</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Explora el catálogo y agrega tus productos favoritos.
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        ← Volver a la tienda
                    </Link>
                </div>
            </section>
        )
    }

    const totalItems = getTotalItems()
    const subtotal = getTotalPrice()
    const standardCost = subtotal >= FREE_SHIPPING_MIN ? 0 : 99
    const shippingCost = shipping === "express" ? 199 : standardCost
    const discount = couponStatus === "applied" ? subtotal * 0.1 : 0
    const total = subtotal - discount + shippingCost

    const handleCoupon = (e: FormEvent) => {
        e.preventDefault()
        const code = couponInput.trim().toUpperCase()
        setCouponStatus(code === "DESC10" ? "applied" : "invalid")
    }

    const handleCheckout = async () => {
        setLoading(true)
        setCheckoutError(null)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({
                        nombre: i.name,
                        precio: i.price,
                        cantidad: i.quantity,
                        imagen: getImageUrl(i.image),
                    })),
                    costoEnvio: shippingCost,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.url) {
                setCheckoutError(data.error ?? "No se pudo iniciar el pago")
                setLoading(false)
                return
            }
            window.location.href = data.url
        } catch {
            setCheckoutError("Error de conexión al iniciar el pago")
            setLoading(false)
        }
    }

    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="flex flex-col p-6 sm:p-8 lg:col-span-2">
                        <div className="flex items-baseline justify-between border-b border-gray-200 pb-5 dark:border-gray-700">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Carrito de compras
                            </h1>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                            </span>
                        </div>

                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {items.map((item) => {
                                const imgSrc = getImageUrl(item.image)
                                return (
                                    <li
                                        key={item.id}
                                        className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap"
                                    >
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-2 dark:bg-gray-700/50">
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">Sin imagen</span>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate font-semibold text-gray-900 dark:text-white">
                                                {item.name}
                                            </h2>
                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                ${item.price.toFixed(2)} c/u
                                            </p>
                                        </div>

                                        <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600">
                                            <button
                                                type="button"
                                                aria-label={`Disminuir cantidad de ${item.name}`}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-2.5 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label={`Aumentar cantidad de ${item.name}`}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2.5 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="w-24 text-right font-semibold text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>

                                        <button
                                            type="button"
                                            aria-label={`Eliminar ${item.name}`}
                                            onClick={() => removeItem(item.id)}
                                            className="ml-1 text-xl leading-none text-gray-400 transition hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                ← Volver a la tienda
                            </Link>
                            <button
                                type="button"
                                onClick={clearCart}
                                className="text-xs font-medium text-gray-500 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </div>

                    <aside className="flex flex-col bg-gray-100 p-6 sm:p-8 dark:bg-gray-900/60 border-t border-gray-200 lg:border-t-0 lg:border-l dark:border-gray-700">
                        <h2 className="border-b border-gray-200 pb-5 text-xl font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                            Resumen
                        </h2>

                        <div className="mt-6 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span>ARTÍCULOS ({totalItems})</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="mt-6">
                            <label
                                htmlFor="shipping"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400"
                            >
                                ENVÍO
                            </label>
                            <select
                                id="shipping"
                                value={shipping}
                                onChange={(e) => setShipping(e.target.value as "standard" | "express")}
                                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="standard">
                                    {standardCost === 0 ? "Envío estándar - Gratis ($0)" : "Envío estándar - $99"}
                                </option>
                                <option value="express">Envío exprés - $199</option>
                            </select>
                        </div>

                        <form onSubmit={handleCoupon} className="mt-6">
                            <label
                                htmlFor="coupon"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400"
                            >
                                CÓDIGO DE DESCUENTO
                            </label>
                            <div className="mt-2 flex">
                                <input
                                    id="coupon"
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    placeholder="Ingresa tu código (DESC10)"
                                    className="w-full rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    aria-label="Aplicar código de descuento"
                                    className="rounded-r-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    →
                                </button>
                            </div>
                            {couponStatus === "applied" ? (
                                <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">
                                    10% aplicado (-${discount.toFixed(2)})
                                </p>
                            ) : null}
                            {couponStatus === "invalid" ? (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    Código no válido
                                </p>
                            ) : null}
                        </form>

                        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <div className="flex items-center justify-between text-base font-bold text-gray-900 dark:text-white">
                                <span>PRECIO TOTAL</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleCheckout}
                                className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {loading ? "Procesando..." : "FINALIZAR COMPRA"}
                            </button>

                            {checkoutError ? (
                                <p className="mt-3 text-center text-xs text-red-600 dark:text-red-400">
                                    {checkoutError}
                                </p>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}
