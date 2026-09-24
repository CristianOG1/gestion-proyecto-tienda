import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
    id: string
    slug: string
    name: string
    price: number
    image: string
    quantity: number
}

type CartState = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id)
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        }
                    }
                    return { items: [...state.items, { ...item, quantity }] }
                })
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }))
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id)
                    return
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () =>
                get().items.reduce((acc, i) => acc + i.quantity, 0),

            getTotalPrice: () =>
                get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),
        {
            name: "cart-storage", // key en localStorage
        }
    )
)