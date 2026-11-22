import Link from "next/link"

type Props = { page: number; pageCount: number; sort?: string }

const href = (page: number, sort?: string) =>
    `?${new URLSearchParams({ page: String(page), ...(sort ? { sort } : {}) })}`
const base = "px-4 py-2 border rounded"

export const Pagination = ({ page, pageCount, sort }: Props) => {
    return (
        <nav aria-label="Paginación" className="flex items-center gap-2 mt-4">
            {page > 1 ? (
                <Link href={href(page - 1, sort)} className={base}>Anterior</Link>
            ) : (
                <span aria-disabled="true" className={`${base} opacity-50`}>Anterior</span>
            )}
            <span className="text-sm dark:text-gray-300">Página {page} de {pageCount}</span>
            {page < pageCount ? (
                <Link href={href(page + 1, sort)} className={base}>Siguiente</Link>
            ) : (
                <span aria-disabled="true" className={`${base} opacity-50`}>Siguiente</span>
            )}
        </nav>
    );
};
