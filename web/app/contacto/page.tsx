
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Contacto | MiduShop",
  description: "Comunícate con MiduShop. Estamos aquí para ayudarte.",
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <section className="mx-auto max-w-5xl">

        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Estamos para ayudarte
          </span>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Contáctanos
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            ¿Tienes alguna duda sobre nuestros productos?
            Ponte en contacto con nosotros. Será un gusto atenderte.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <EnvelopeIcon className="h-7 w-7 text-blue-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Correo electrónico
            </h2>

            <p className="mt-3 text-gray-600">
              Escríbenos para resolver tus dudas sobre nuestros productos
              y recibir atención.
            </p>

            <a
              href="mailto:contacto@mitienda.com"
              className="mt-6 inline-block font-semibold text-blue-600 transition hover:text-blue-800"
            >
              contacto@mitienda.com
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
              <ChatBubbleLeftRightIcon className="h-7 w-7 text-green-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              WhatsApp
            </h2>

            <p className="mt-3 text-gray-600">
              Comunícate con nosotros para recibir atención personalizada
              y resolver tus consultas.
            </p>

            <span className="mt-6 inline-block font-semibold text-green-600">
              00-00-00-00-00
            </span>
          </div>

        </div>

      </section>
    </main>
  );
}
