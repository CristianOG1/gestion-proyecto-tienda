import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const HOST = "https://strapi.example.com"

async function load() {
    vi.resetModules()
    return (await import("./image-url")).getImageUrl
}

describe("getImageUrl", () => {
    beforeEach(() => vi.stubEnv("STRAPI_HOST", HOST))
    afterEach(() => vi.unstubAllEnvs())

    it("devuelve null para valores vacíos", async () => {
        const getImageUrl = await load()
        expect(getImageUrl(null)).toBeNull()
        expect(getImageUrl(undefined)).toBeNull()
        expect(getImageUrl("")).toBeNull()
    })

    it("respeta URLs absolutas https (Cloudinary)", async () => {
        const getImageUrl = await load()
        const url = "https://res.cloudinary.com/demo/image/upload/a.jpg"
        expect(getImageUrl(url)).toBe(url)
    })

    it("respeta URLs absolutas http", async () => {
        const getImageUrl = await load()
        expect(getImageUrl("http://cdn.test/a.png")).toBe("http://cdn.test/a.png")
    })

    it("completa rutas relativas con STRAPI_HOST", async () => {
        const getImageUrl = await load()
        expect(getImageUrl("/uploads/a.jpg")).toBe(`${HOST}/uploads/a.jpg`)
    })
})
