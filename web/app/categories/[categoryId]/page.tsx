import { SortBy } from "@/components/SortBy"
import { Pagination } from "@/components/Pagination"
import Link from "next/link"
import { getProducts } from "@/lib/get-product"

export default async function CategoryPage(
    { params }: 
    { params: Promise<{categoryId: string}> }
) {
    const { categoryId } = await params
    const { pagination, products } = await getProducts({categoryId})

    return (
        <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-16 min-h-screen">
            <div className="container mx-auto">
                <Link href="/" className="inline-flex items-center bg-blue-600 gap-2 rounded-full px-5 py-2 text-sm font-medium mb-5">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    Regresar al inicio
                </Link>

                {products.length > 0 && <SortBy/>}

                <div className="grid grid-cols-3 gap-4 mt-6">
                    {
                        products.length == 0 && <div className="w-full max-w-sm flex">
                            <div className="px-5 pb-5">
                                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                    No se encontraron Productos
                                </h5>
                            </div>
                        </div>
                    }
                    { products.length > 0 && products.map((product) => 
                        <div key={product.slug} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <img className="p-8 rounded-t-lg" src={product.image} alt="product image" />
                            </a>
                            <div className="px-5 pb-5">
                                <a href="#">
                                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                                </a>
                                <div className="flex items-center mt-2.5 mb-5"> 
                                    <div className="flex items-center space-x-1 rtl:space-x-reverse">

                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        ${product.price}
                                    </span>
                                    <button
                                        type="button"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {products.length > 0 && <Pagination pagination={pagination} />}

            </div>
        </section>
    )
}