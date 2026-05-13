import { db } from "@/db/client";
import { pedidos, clientes, detallesPedidos, productos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export interface OrderSummary {
  id: number;
  estado: string;
  total: number;
  fecha: Date;
  tipo: string;
  detalles: Array<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: { id: number; nombre: string };
  }>;
}

export async function getOrdersByPhone(
  telefono: string
): Promise<OrderSummary[]> {
  // Find client by phone
  const cliente = await db.query.clientes.findFirst({
    where: eq(clientes.telefono, telefono),
  });

  if (!cliente) {
    return [];
  }

  // Get all orders for this client
  const orders = await db.query.pedidos.findMany({
    where: eq(pedidos.clienteId, cliente.id),
    orderBy: [desc(pedidos.fecha)],
    with: {
      detalles: {
        with: {
          producto: {
            columns: { id: true, nombre: true },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    estado: order.estado,
    total: order.total,
    fecha: order.fecha,
    tipo: order.tipo,
    detalles: order.detalles.map((d) => ({
      id: d.id,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.subtotal,
      producto: { id: d.producto.id, nombre: d.producto.nombre },
    })),
  }));
}
