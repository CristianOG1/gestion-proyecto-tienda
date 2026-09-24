import { SortBy } from "@/components/SortBy"
import { Pagination } from "@/components/Pagination"
import Link from "next/link"
import { getProducts } from "@/lib/get-product"
import { AddToCartButton } from "@/components/AddToCartButton"

export default async function CategoryPage(
    { params }: 
    { params: Promise<{categoryId: string}> }
) {
    const { categoryId } = await params
    const { pagination, products } = await getProducts({categoryId})

    return (
        <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-16 min-h-screen">
            <div className="container mx-auto px-4">
                <Link href="/" className="inline-flex items-center bg-blue-600 text-white gap-2 rounded-full px-5 py-2 text-sm font-medium mb-5">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    Regresar al inicio
                </Link>

                {products.length > 0 && <SortBy/>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                    {
                        products.length == 0 && <div className="w-full flex">
                            <div className="px-5 pb-5">
                                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                    No se encontraron Productos
                                </h5>
                            </div>
                        </div>
                    }
                    { products.length > 0 && products.map((product) => 
                        <div key={product.slug} className="w-full flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#" className="flex justify-center">
                                <img className="p-8 rounded-t-lg w-full h-102 object-contain" src={product.image} alt="product image" />
                            </a>
                            <div className="px-5 pb-5 flex flex-col flex-1">
                                <a href="#">
                                    <h5 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                                        {product.name}
                                    </h5>
                                </a>
                                <div className="flex items-center mt-2.5 mb-5">
                                    <div className="flex items-center space-x-1 rtl:space-x-reverse" />
                                </div>
                                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                            ${product.price}
                                        </span>
                                        <AddToCartButton
                                            product={{
                                                id: product.id, // asegúrate que get-product.ts devuelva el id de Strapi
                                                slug: product.slug,
                                                name: product.name,
                                                price: product.price,
                                                image: product.image,
                                            }}
                                        />
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