import { relations } from "drizzle-orm";
import { usuarios } from "./usuarios";
import { clientes } from "./clientes";
import { productos } from "./productos";
import { proveedores } from "./proveedores";
import { inventario } from "./inventario";
import { pedidos } from "./pedidos";
import { detallesPedidos } from "./detalles-pedidos";
import { pagos } from "./pagos";
import { ordenesCompra } from "./ordenes-compra";
import { ordenesCompraProductos } from "./ordenes-compra-productos";
import { reportes } from "./reportes";

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  pedidos: many(pedidos),
}));

export const clientesRelations = relations(clientes, ({ many }) => ({
  pedidos: many(pedidos),
}));

export const productosRelations = relations(productos, ({ one, many }) => ({
  inventario: one(inventario),
  detallesPedido: many(detallesPedidos),
  ordenesCompra: many(ordenesCompraProductos),
}));

export const proveedoresRelations = relations(proveedores, ({ many }) => ({
  ordenesCompra: many(ordenesCompra),
}));

export const inventarioRelations = relations(inventario, ({ one }) => ({
  producto: one(productos, {
    fields: [inventario.productoId],
    references: [productos.id],
  }),
}));

export const pedidosRelations = relations(pedidos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [pedidos.clienteId],
    references: [clientes.id],
  }),
  usuario: one(usuarios, {
    fields: [pedidos.usuarioId],
    references: [usuarios.id],
  }),
  detalles: many(detallesPedidos),
  pago: one(pagos),
}));

export const detallesPedidosRelations = relations(detallesPedidos, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [detallesPedidos.pedidoId],
    references: [pedidos.id],
  }),
  producto: one(productos, {
    fields: [detallesPedidos.productoId],
    references: [productos.id],
  }),
}));

export const pagosRelations = relations(pagos, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [pagos.pedidoId],
    references: [pedidos.id],
  }),
}));

export const ordenesCompraRelations = relations(ordenesCompra, ({ one, many }) => ({
  proveedor: one(proveedores, {
    fields: [ordenesCompra.proveedorId],
    references: [proveedores.id],
  }),
  productos: many(ordenesCompraProductos),
}));

export const ordenesCompraProductosRelations = relations(ordenesCompraProductos, ({ one }) => ({
  ordenCompra: one(ordenesCompra, {
    fields: [ordenesCompraProductos.ordenCompraId],
    references: [ordenesCompra.id],
  }),
  producto: one(productos, {
    fields: [ordenesCompraProductos.productoId],
    references: [productos.id],
  }),
}));

export const reportesRelations = relations(reportes, () => ({}));
