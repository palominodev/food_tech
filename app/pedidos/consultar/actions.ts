"use server";

import { getOrdersByPhone } from "@/features/pedidos/services/get-orders-by-phone";

export async function searchOrders(telefono: string) {
  if (!telefono.trim()) {
    return { error: { code: "VALIDATION", message: "Ingresá tu número de teléfono" } };
  }

  try {
    const orders = await getOrdersByPhone(telefono.trim());
    // Serialize dates for client component
    const serialized = orders.map((o) => ({
      ...o,
      fecha: o.fecha.toISOString(),
    }));
    return { success: true, orders: serialized };
  } catch {
    return { error: { code: "SERVER_ERROR", message: "Error al buscar pedidos. Intentá de nuevo." } };
  }
}
