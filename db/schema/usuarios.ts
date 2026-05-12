import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const usuarios = sqliteTable("usuarios", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  rol: text("rol", {
    enum: ["administrador", "cajero", "cocinero", "mesero"],
  }).notNull(),
  estado: integer("estado", { mode: "boolean" }).notNull().default(true),
});

export type InsertUsuario = typeof usuarios.$inferInsert;
export type SelectUsuario = typeof usuarios.$inferSelect;
