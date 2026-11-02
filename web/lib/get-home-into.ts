import { getImageUrl } from "./image-url";
import { query } from "./strapi";

const { STRAPI_HOST } = process.env

export function getHomeInfo() {
    return query("home?populate=cover")
    .then(res => {

        if (!res.data) {
            return { title: "Mi Tienda", description: "Cargando...", image: null };
        }

        const { title, description, cover } = res.data
        const image = getImageUrl(cover?.url)
        return {title, description, image}
    })
}