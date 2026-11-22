import { getImageUrl } from "./image-url";
import { query } from "./strapi";

type StrapiProduct = {
    documentId: string
    name: string
    slug: string
    description: unknown
    price: number
    images?: { url: string }[]
}

const toProduct = ({ documentId, name, slug, description, price, images }: StrapiProduct) => ({
    id: documentId,
    name,
    slug,
    description,
    price,
    image: getImageUrl(images?.[0]?.url),
})

export type ProductPagination = { page: number; pageSize: number; pageCount: number; total: number }

export function getProducts({ categoryId, page = 1, sort }: { categoryId: string; page?: number; sort?: "price:asc" }) {
    const sortParam = sort ? `&sort=${sort}` : ""
    return query(`products?filters[product_category][slug][$contains]=${categoryId}&populate=images&pagination[page]=${page}&pagination[pageSize]=12${sortParam}`)
        .then(res => {
            const { data, meta } = res
            if (!data) return { products: [], pagination: null }
            return {
                products: (data as StrapiProduct[]).map(toProduct),
                pagination: (meta?.pagination ?? null) as ProductPagination | null,
            }
        })
}

export function getFeaturedProducts() {
    return query("products?filters[isActive][$eq]=true&sort=createdAt:desc&pagination[pageSize]=8&populate=images")
        .then(res => ((res.data ?? []) as StrapiProduct[]).map(toProduct))
}