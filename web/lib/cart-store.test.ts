import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

const storage = new Map<string, string>()
// zustand persist lee window.localStorage, que no existe en Node
vi.stubGlobal("window", {
    localStorage: {
        getItem: (k: string) => storage.get(k) ?? null,
        setItem: (k: string, v: string) => void storage.set(k, v),
        removeItem: (k: string) => void storage.delete(k),
    },
})

let useCartStore: typeof import("./cart-store").useCartStore

const a = { id: "a", slug: "a", name: "A", price: 10.5, image: "" }
const b = { id: "b", slug: "b", name: "B", price: 3, image: "" }

describe("useCartStore", () => {
    beforeAll(async () => {
        ;({ useCartStore } = await import("./cart-store"))
    })

    beforeEach(() => {
        useCartStore.setState({ items: [] })
        storage.clear()
    })

    it("agrega un ítem nuevo con su cantidad", () => {
        useCartStore.getState().addItem(a, 2)
        expect(useCartStore.getState().items).toEqual([{ ...a, quantity: 2 }])
    })

    it("acumula la cantidad si el id ya existe", () => {
        const { addItem } = useCartStore.getState()
        addItem(a)
        addItem(a, 3)
        expect(useCartStore.getState().items).toEqual([{ ...a, quantity: 4 }])
    })

    it("mantiene líneas separadas para ids distintos", () => {
        const { addItem } = useCartStore.getState()
        addItem(a)
        addItem(b)
        expect(useCartStore.getState().items.map((i) => i.id)).toEqual(["a", "b"])
    })

    it("updateQuantity cambia la cantidad y elimina con <= 0", () => {
        const { addItem, updateQuantity } = useCartStore.getState()
        addItem(a)
        updateQuantity("a", 5)
        expect(useCartStore.getState().items[0].quantity).toBe(5)
        updateQuantity("a", 0)
        expect(useCartStore.getState().items).toEqual([])
    })

    it("removeItem y clearCart vacían el carrito", () => {
        const { addItem, removeItem, clearCart } = useCartStore.getState()
        addItem(a)
        addItem(b)
        removeItem("a")
        expect(useCartStore.getState().items.map((i) => i.id)).toEqual(["b"])
        clearCart()
        expect(useCartStore.getState().items).toEqual([])
    })

    it("calcula totales de artículos y precio", () => {
        const { addItem, getTotalItems, getTotalPrice } = useCartStore.getState()
        addItem(a, 2)
        addItem(b, 1)
        expect(getTotalItems()).toBe(3)
        expect(getTotalPrice()).toBe(24)
    })

    it("persiste en localStorage bajo cart-storage", () => {
        useCartStore.getState().addItem(a)
        const saved = JSON.parse(storage.get("cart-storage") ?? "{}")
        expect(saved.state.items).toEqual([{ ...a, quantity: 1 }])
    })
})
