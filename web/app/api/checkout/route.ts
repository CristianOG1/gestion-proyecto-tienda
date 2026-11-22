import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutItem = {
    nombre: string;
    precio: number;
    cantidad: number;
    imagen?: string | null;
};

export async function POST(req: NextRequest) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        return NextResponse.json(
            { error: "Falta configurar STRIPE_SECRET_KEY" },
            { status: 500 }
        );
    }

    let body: { items?: unknown; costoEnvio?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
            { error: "Agrega al menos un producto al carrito" },
            { status: 400 }
        );
    }

    const items = body.items as CheckoutItem[];
    for (const item of items) {
        if (
            !item?.nombre ||
            typeof item.precio !== "number" ||
            item.precio <= 0 ||
            !Number.isInteger(item.cantidad) ||
            item.cantidad < 1
        ) {
            return NextResponse.json(
                { error: "Datos de producto inválidos" },
                { status: 400 }
            );
        }
    }

    const costoEnvio = typeof body.costoEnvio === "number" && body.costoEnvio > 0 ? body.costoEnvio : 0;
    const stripe = new Stripe(secretKey);
    const origin = req.nextUrl.origin;

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
        price_data: {
            currency: "mxn",
            product_data: {
                name: item.nombre,
                ...(item.imagen && /^https?:\/\//.test(item.imagen) ? { images: [item.imagen] } : {}),
            },
            unit_amount: Math.round(item.precio * 100),
        },
        quantity: item.cantidad,
    }));

    if (costoEnvio > 0) {
        line_items.push({
            price_data: {
                currency: "mxn",
                product_data: { name: "Envío" },
                unit_amount: Math.round(costoEnvio * 100),
            },
            quantity: 1,
        });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            success_url: `${origin}/pago/exito`,
            cancel_url: `${origin}/pago/cancelado`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error al crear la sesión de pago";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
