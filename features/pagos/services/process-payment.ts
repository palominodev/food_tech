import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { pedidos } from "@/db/schema/pedidos";
import { pagos } from "@/db/schema/pagos";
import { PEDIDO_ESTADO } from "@/db/constants";
import { AppError, NotFoundError, OrderAlreadyPaidError } from "@/lib/errors";
import type { PaymentInput, PaymentResult } from "@/features/pagos/types";

export async function processPayment(
  input: PaymentInput
): Promise<PaymentResult> {
  const { pedidoId, metodo } = input;

  return db.transaction(async (tx) => {
    const pedidoRows = await tx
      .select()
      .from(pedidos)
      .where(eq(pedidos.id, pedidoId))
      .limit(1);

    const pedido = pedidoRows[0];
    if (!pedido) {
      throw new NotFoundError("Pedido");
    }

    if (pedido.estado === PEDIDO_ESTADO.Pagado) {
      throw new OrderAlreadyPaidError();
    }

    if (pedido.estado === PEDIDO_ESTADO.Cancelado) {
      throw new AppError(
        "ORDER_CANCELLED",
        "Cannot pay for a cancelled order",
        409
      );
    }

    const pagoRows = await tx
      .insert(pagos)
      .values({
        pedidoId,
        monto: pedido.total,
        metodo,
        estado: "Confirmado",
      })
      .returning();

    const pago = pagoRows[0];

    await tx
      .update(pedidos)
      .set({ estado: PEDIDO_ESTADO.Pagado })
      .where(eq(pedidos.id, pedidoId));

    return { success: true, pagoId: pago.id };
  });
}
