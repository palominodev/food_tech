import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const reportes = sqliteTable("reportes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  tipo: text("tipo").notNull(),
  fechaInicio: integer("fecha_inicio", { mode: "timestamp" }).notNull(),
  fechaFin: integer("fecha_fin", { mode: "timestamp" }).notNull(),
});

export type InsertReporte = typeof reportes.$inferInsert;
export type SelectReporte = typeof reportes.$inferSelect;
