import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const productos = sqliteTable("productos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  precio: real("precio").notNull(),
  categoria: text("categoria").notNull(),
  disponible: integer("disponible", { mode: "boolean" }).notNull().default(true),
});

export type InsertProducto = typeof productos.$inferInsert;
export type SelectProducto = typeof productos.$inferSelect;
