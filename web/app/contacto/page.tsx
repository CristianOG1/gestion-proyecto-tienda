export const metadata = {
  title: "Contacto | MiduShop",
  description: "Información de contacto de nuestra tienda.",
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <section className="mx-auto max-w-5xl">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Contáctanos
          </h1>

          <p className="mt-4 text-gray-600">
            Estamos aquí para ayudarte. Conoce nuestros medios
            de contacto y comunícate con nosotros.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">

          <div className="rounded-xl border border-gray-200 p-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Correo electrónico
            </h2>

            <p className="text-gray-600">
              Escríbenos para resolver tus dudas sobre nuestros productos.
            </p>

            <p className="mt-4 font-medium text-blue-600">
              contacto@mitienda.com
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              WhatsApp
            </h2>

            <p className="text-gray-600">
              Comunícate con nosotros para recibir atención personalizada.
            </p>

            <p className="mt-4 font-medium text-blue-600">
              Número de contacto de la tienda
            </p>
          </div>

        </div>

      </section>
    </main>
  );
}
