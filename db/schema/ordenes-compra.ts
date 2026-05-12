import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { proveedores } from "./proveedores";

export const ordenesCompra = sqliteTable("ordenes_compra", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  proveedorId: integer("proveedor_id", { mode: "number" })
    .notNull()
    .references(() => proveedores.id),
  fecha: integer("fecha", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  estado: text("estado").notNull(),
});

export type InsertOrdenCompra = typeof ordenesCompra.$inferInsert;
export type SelectOrdenCompra = typeof ordenesCompra.$inferSelect;
