"use server";

import { createOrder } from "@/features/pedidos/services/create-order";
import { getMenu } from "@/features/menu/services/get-menu";
import { AppError } from "@/lib/errors";

export async function getProducts() {
  try {
    const items = await getMenu();
    return { success: true as const, items };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false as const,
        error: { code: error.code, message: error.message },
      };
    }
    return {
      success: false as const,
      error: { code: "UNKNOWN_ERROR", message: "Failed to load products" },
    };
  }
}

export async function submitOrder(data: {
  nombre: string;
  telefono: string;
  items: Array<{ productoId: number; cantidad: number }>;
}) {
  try {
    const result = await createOrder({
      cliente: { nombre: data.nombre, telefono: data.telefono },
      items: data.items,
    });

    return {
      success: true as const,
      pedidoId: result.pedido.id,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false as const,
        error: { code: error.code, message: error.message },
      };
    }
    return {
      success: false as const,
      error: { code: "UNKNOWN_ERROR", message: "Something went wrong" },
    };
  }
}
