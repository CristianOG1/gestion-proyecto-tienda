"use client"

import { useCartStore } from "@/lib/cart-store"

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

    if (items.length === 0) {
        return (
            <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 text-center">
                <p className="text-xl text-gray-700 dark:text-gray-300">Tu carrito está vacío</p>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Mi Carrito</h1>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                            <div className="flex-1">
                                <h3 className="font-semibold dark:text-white">{item.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">${item.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                                </div>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm">
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-xl font-bold dark:text-white">
                        Total: ${getTotalPrice().toFixed(2)}
                    </span>
                    <button
                        onClick={clearCart}
                        className="text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 text-sm"
                    >
                        Vaciar carrito
                    </button>
                </div>
            </div>
        </section>
    )
}