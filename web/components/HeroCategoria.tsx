import Link from "next/link";
import { getImageUrl } from "@/lib/image-url";

type Props = {
    nombre: string;
    descripcion?: string | null;
    imagen?: string | null;
    totalProductos: number;
};

export function HeroCategoria({ nombre, descripcion, imagen, totalProductos }: Props) {
    const imgSrc = getImageUrl(imagen);

    return (
        <section className="relative overflow-hidden bg-gray-900">
            {imgSrc ? (
                <img
                    src={imgSrc}
                    alt=""
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-16 2xl:px-0">
                <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                    <Link href="/" className="transition hover:text-white">
                        Inicio
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link href="/categorias" className="transition hover:text-white">
                        Categorías
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span className="font-medium text-white">{nombre}</span>
                </nav>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        {nombre}
                    </h1>
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {totalProductos} {totalProductos === 1 ? "producto" : "productos"}
                    </span>
                </div>

                {descripcion ? (
                    <p className="mt-2 max-w-2xl text-sm text-gray-200 sm:text-base">
                        {descripcion}
                    </p>
                ) : null}
            </div>
        </section>
    );
}
