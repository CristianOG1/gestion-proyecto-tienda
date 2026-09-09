import { query } from "./strapi";

// CORRECCIÓN 1: No desestructurar variables de entorno en Next.js
const STRAPI_HOST = process.env.STRAPI_HOST;

export function getProducts (
    { categoryId }:
    { categoryId: string }
){
    // CORRECCIÓN: El segundo ? debe ser &
    return query(`products?locale=es-MX&filters[product_category][slug][$contains]=${categoryId}&populate=images`)
        .then( res => {
            const { data, meta } = res;
            console.log(data)

            // SEGURIDAD: Prevenir errores si Strapi no devuelve "data"
            if (!data) return { products: [], pagination: null };

            const products = data.map(product => {
                const { name, slug, description, images: rawImages, price} = product;
                
                // SEGURIDAD: Verificar que el arreglo de imágenes exista y tenga al menos una foto
                let image = null;
                if (rawImages && rawImages.length > 0 && rawImages[0].url) {
                    // CORRECCIÓN 3: Quitar la barra inclinada extra porque url ya la incluye ("/uploads/...")
                    image = `${STRAPI_HOST}${rawImages[0].url}`;
                }
                
                return { name, slug, description, image, price};
            })

            // SEGURIDAD: Usar el operador ? por si "meta" llega vacío
            return { products, pagination: meta?.pagination };
        })
}