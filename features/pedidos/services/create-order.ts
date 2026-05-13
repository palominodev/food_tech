import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { clientes } from "@/db/schema/clientes";
import { productos } from "@/db/schema/productos";
import { inventario } from "@/db/schema/inventario";
import { pedidos } from "@/db/schema/pedidos";
import { detallesPedidos } from "@/db/schema/detalles-pedidos";
import {
  SYSTEM_USER_ID,
  PEDIDO_ESTADO,
  PEDIDO_TIPO,
} from "@/db/constants";
import { AppError, StockInsufficientError } from "@/lib/errors";
import type { CreateOrderInput, OrderResult } from "../types";

export async function createOrder(
  input: CreateOrderInput
): Promise<OrderResult> {
  const {
    cliente: clienteInput,
    items,
    tipo = PEDIDO_TIPO.Online,
  } = input;

  if (!items || items.length === 0) {
    throw new AppError(
      "EMPTY_ORDER",
      "Order must contain at least one item",
      400
    );
  }

  for (const item of items) {
    if (item.cantidad <= 0) {
      throw new AppError(
        "INVALID_QUANTITY",
        `Invalid quantity for product ${item.productoId}`,
        400
      );
    }
  }

  const productoIds = items.map((i) => i.productoId);

  return db.transaction(async (tx) => {
    // 1. Find or create cliente by telefono
    const existingClientes = await tx
      .select()
      .from(clientes)
      .where(eq(clientes.telefono, clienteInput.telefono))
      .limit(1);

    let cliente = existingClientes[0];

    if (!cliente) {
      const inserted = await tx
        .insert(clientes)
        .values({
          nombre: clienteInput.nombre,
          telefono: clienteInput.telefono,
        })
        .returning();
      cliente = inserted[0];
    }

    // 2. Fetch products
    const productRows = await tx
      .select()
      .from(productos)
      .where(inArray(productos.id, productoIds));

    const productMap = new Map(productRows.map((p) => [p.id, p]));

    // 3. Validate products exist and are disponible
    for (const item of items) {
      const producto = productMap.get(item.productoId);
      if (!producto) {
        throw new AppError(
          "PRODUCT_NOT_FOUND",
          `Product ${item.productoId} not found`,
          404
        );
      }
      if (!producto.disponible) {
        throw new AppError(
          "PRODUCT_UNAVAILABLE",
          `Product ${item.productoId} is not available`,
          409
        );
      }
    }

    // 4. Validate stock
    const stockRows = await tx
      .select()
      .from(inventario)
      .where(inArray(inventario.productoId, productoIds));

    const stockMap = new Map(
      stockRows.map((s) => [s.productoId, s.stockActual])
    );

    for (const item of items) {
      const stock = stockMap.get(item.productoId) ?? 0;
      if (stock < item.cantidad) {
        throw new StockInsufficientError(item.productoId);
      }
    }

    // 5. Compute total and build detalle values
    let total = 0;
    const detallesValues = items.map((item) => {
      const producto = productMap.get(item.productoId)!;
      const precioUnitario = producto.precio;
      const subtotal = item.cantidad * precioUnitario;
      total += subtotal;
      return {
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
      };
    });

    // 6. Create pedido
    const pedidoRows = await tx
      .insert(pedidos)
      .values({
        clienteId: cliente.id,
        usuarioId: SYSTEM_USER_ID,
        estado: PEDIDO_ESTADO.Registrado,
        tipo,
        total,
        fecha: new Date(),
      })
      .returning();

    const pedido = pedidoRows[0];

    // 7. Create detalles
    const detallesWithPedido = detallesValues.map((d) => ({
      ...d,
      pedidoId: pedido.id,
    }));

    await tx.insert(detallesPedidos).values(detallesWithPedido);

    // 8. Fetch inserted detalles with product info
    const detallesResult = await tx
      .select()
      .from(detallesPedidos)
      .where(eq(detallesPedidos.pedidoId, pedido.id));

    const detallesWithProduct = detallesResult.map((d) => {
      const producto = productMap.get(d.productoId)!;
      return {
        id: d.id,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal,
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
        },
      };
    });

    return {
      pedido: {
        id: pedido.id,
        estado: pedido.estado,
        total: pedido.total,
        fecha: pedido.fecha,
      },
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono ?? "",
      },
      detalles: detallesWithProduct,
    };
  });
}
