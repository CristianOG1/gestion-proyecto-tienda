"use client"

import { useState } from "react"
import Link from "next/link"
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"

export function NavMenu({ categories }: { categories: Category[] }) {
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { href: "/", label: "Inicio" },
        ...categories.map((c) => ({
          href: `/categories/${c.slug}`,
          label: c.name,
        })),
      ]
    return (
        <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="container mx-auto flex flex-wrap items-center justify-between py-4">
                <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">
                    MiTienda
                </Link>

                <div className="flex items-center gap-4 md:order-2">
                    <Link href="/cart" className="relative text-gray-900 dark:text-white">
                        <ShoppingCartIcon className="w-6 h-6" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </div>

                <div className={`${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`}>
                    <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}