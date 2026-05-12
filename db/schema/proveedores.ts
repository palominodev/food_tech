import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const proveedores = sqliteTable("proveedores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  contacto: text("contacto"),
});

export type InsertProveedor = typeof proveedores.$inferInsert;
export type SelectProveedor = typeof proveedores.$inferSelect;
