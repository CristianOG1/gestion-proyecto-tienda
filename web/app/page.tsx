import Link from "next/link";
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Hero } from "../components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Inicio | MiTienda",
  description: "Compra en línea tus productos favoritos con pago seguro y envío a todo el país.",
};

const BENEFITS = [
  { icon: TruckIcon, title: "Envíos rápidos", desc: "Entrega segura a todo el país" },
  { icon: ArrowPathIcon, title: "Cambios fáciles", desc: "Hasta 30 días sin complicaciones" },
  { icon: ShieldCheckIcon, title: "Pago seguro", desc: "Transacciones protegidas" },
  { icon: ChatBubbleLeftRightIcon, title: "Soporte cercano", desc: "Atención en cada compra" },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 2xl:px-0">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Categories />

      <section className="bg-gray-50 px-4 py-6 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white sm:flex-row sm:items-center md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Temporada activa
            </p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Envío gratis en pedidos mayores a $999
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Agrega tus favoritos al carrito y recibe en la puerta de tu casa.
            </p>
          </div>
          <Link
            href="/cart"
            className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Ver mi carrito
          </Link>
        </div>
      </section>

      <FeaturedProducts />
    </>
  );
}
