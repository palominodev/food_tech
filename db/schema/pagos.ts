import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { pedidos } from "./pedidos";

export const pagos = sqliteTable("pagos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  pedidoId: integer("pedido_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => pedidos.id),
  monto: real("monto").notNull(),
  metodo: text("metodo").notNull(),
  estado: text("estado").notNull(),
});

export type InsertPago = typeof pagos.$inferInsert;
export type SelectPago = typeof pagos.$inferSelect;
