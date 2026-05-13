"use server";

import { processPayment } from "@/features/pagos/services/process-payment";
import { getOrderStatus } from "@/features/pedidos/services/get-order-status";
import { AppError } from "@/lib/errors";

export async function getOrderForPayment(data: {
  pedidoId: number;
  telefono: string;
}) {
  try {
    const order = await getOrderStatus(data);
    return { success: true as const, order };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false as const,
        error: { code: error.code, message: error.message },
      };
    }
    return {
      success: false as const,
      error: { code: "UNKNOWN_ERROR", message: "Failed to load order" },
    };
  }
}

export async function submitPayment(data: {
  pedidoId: number;
  metodo: string;
}) {
  try {
    const result = await processPayment({
      pedidoId: data.pedidoId,
      metodo: data.metodo,
    });
    return { success: true as const, pagoId: result.pagoId };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false as const,
        error: { code: error.code, message: error.message },
      };
    }
    return {
      success: false as const,
      error: { code: "UNKNOWN_ERROR", message: "Payment failed" },
    };
  }
}
