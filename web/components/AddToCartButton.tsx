"use client"

import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"

type Props = {
    product: {
        id: string
        slug: string
        name: string
        price: number
        image: string
    }
}

export function AddToCartButton({ product }: Props) {
    const addItem = useCartStore((state) => state.addItem)
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        addItem(product, 1)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    return (
        <button
            type="button"
            onClick={handleAdd}
            className="w-full sm:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
        >
            {added ? "¡Añadido! ✓" : "Añadir al carrito"}
        </button>
    )
}