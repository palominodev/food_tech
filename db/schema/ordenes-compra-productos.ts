import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { ordenesCompra } from "./ordenes-compra";
import { productos } from "./productos";

export const ordenesCompraProductos = sqliteTable("ordenes_compra_productos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ordenCompraId: integer("orden_compra_id", { mode: "number" })
    .notNull()
    .references(() => ordenesCompra.id),
  productoId: integer("producto_id", { mode: "number" })
    .notNull()
    .references(() => productos.id),
  cantidad: integer("cantidad", { mode: "number" }).notNull().default(1),
});

export type InsertOrdenCompraProducto = typeof ordenesCompraProductos.$inferInsert;
export type SelectOrdenCompraProducto = typeof ordenesCompraProductos.$inferSelect;
