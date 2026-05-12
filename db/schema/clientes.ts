import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const clientes = sqliteTable("clientes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  telefono: text("telefono"),
});

export type InsertCliente = typeof clientes.$inferInsert;
export type SelectCliente = typeof clientes.$inferSelect;
