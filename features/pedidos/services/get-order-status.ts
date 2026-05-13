import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { pedidos } from "@/db/schema/pedidos";
import { NotFoundError } from "@/lib/errors";
import type { OrderSummary } from "@/features/pedidos/types";

export async function getOrderStatus(input: {
  pedidoId: number;
  telefono: string;
}): Promise<OrderSummary> {
  const { pedidoId, telefono } = input;

  const result = await db.query.pedidos.findFirst({
    where: eq(pedidos.id, pedidoId),
    with: {
      cliente: true,
      detalles: {
        with: {
          producto: true,
        },
      },
    },
  });

  if (!result) {
    throw new NotFoundError("Pedido");
  }

  if (result.cliente?.telefono !== telefono) {
    throw new NotFoundError("Pedido");
  }

  return {
    id: result.id,
    estado: result.estado,
    total: result.total,
    fecha: result.fecha,
    cliente: {
      id: result.cliente.id,
      nombre: result.cliente.nombre,
      telefono: result.cliente.telefono ?? "",
    },
    detalles: result.detalles.map((d) => ({
      id: d.id,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.subtotal,
      producto: {
        id: d.producto.id,
        nombre: d.producto.nombre,
        precio: d.producto.precio,
      },
    })),
  };
}
