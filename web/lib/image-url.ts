const STRAPI_HOST = process.env.STRAPI_HOST ?? "";

export function getImageUrl(url?: string | null): string | null {
  if (!url) return null;

  // Cloudinary (y cualquier URL completa): se usa tal cual
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Ruta relativa de Strapi (imágenes antiguas): se completa con el host
  return `${STRAPI_HOST}${url}`;
}