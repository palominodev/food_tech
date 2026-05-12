import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { productos } from "./productos";

export const inventario = sqliteTable("inventario", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  productoId: integer("producto_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => productos.id),
  stockActual: integer("stock_actual", { mode: "number" }).notNull().default(0),
  stockMinimo: integer("stock_minimo", { mode: "number" }).notNull().default(0),
});

export type InsertInventario = typeof inventario.$inferInsert;
export type SelectInventario = typeof inventario.$inferSelect;
