import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { clientes } from "./clientes";
import { usuarios } from "./usuarios";

export const pedidos = sqliteTable("pedidos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  clienteId: integer("cliente_id", { mode: "number" })
    .notNull()
    .references(() => clientes.id),
  usuarioId: integer("usuario_id", { mode: "number" })
    .notNull()
    .references(() => usuarios.id),
  fecha: integer("fecha", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  estado: text("estado").notNull(),
  total: real("total").notNull().default(0),
  tipo: text("tipo").notNull(),
});

export type InsertPedido = typeof pedidos.$inferInsert;
export type SelectPedido = typeof pedidos.$inferSelect;
