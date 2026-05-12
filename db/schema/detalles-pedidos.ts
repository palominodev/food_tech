import { sqliteTable, integer, real } from "drizzle-orm/sqlite-core";
import { pedidos } from "./pedidos";
import { productos } from "./productos";

export const detallesPedidos = sqliteTable("detalles_pedidos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  pedidoId: integer("pedido_id", { mode: "number" })
    .notNull()
    .references(() => pedidos.id),
  productoId: integer("producto_id", { mode: "number" })
    .notNull()
    .references(() => productos.id),
  cantidad: integer("cantidad", { mode: "number" }).notNull(),
  precioUnitario: real("precio_unitario").notNull(),
  subtotal: real("subtotal").notNull(),
});

export type InsertDetallePedido = typeof detallesPedidos.$inferInsert;
export type SelectDetallePedido = typeof detallesPedidos.$inferSelect;
