import { cache } from "react";
import { getImageUrl } from "./image-url";
import { query } from "./strapi";

type StrapiCategory = {
    name: string
    slug: string
    description: string
    image?: { url: string } | null
}

export const getCategories = cache(() =>
    query("product-categories?fields[0]=name&fields[1]=slug&fields[2]=description&populate[image][fields][0]=url")
        .then(res => {
            if (!res.data) {
                console.error("Strapi devolvió un error:", res.error);
                return [];
            }
            return (res.data as StrapiCategory[]).map(({ name, slug, description, image: rawImage }) => ({
                name,
                slug,
                description,
                image: getImageUrl(rawImage?.url),
            }));
        })
);