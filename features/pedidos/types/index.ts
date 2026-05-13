import type { SelectPedido } from "@/db/schema/pedidos";
import type { SelectCliente } from "@/db/schema/clientes";
import type { PEDIDO_TIPO } from "@/db/constants";

export interface CreateOrderInput {
  cliente: { nombre: string; telefono: string };
  items: Array<{ productoId: number; cantidad: number }>;
  tipo?: (typeof PEDIDO_TIPO)[keyof typeof PEDIDO_TIPO];
}

export interface DetalleWithProduct {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto: { id: number; nombre: string; precio: number };
}

export interface OrderResult {
  pedido: { id: number; estado: string; total: number; fecha: Date };
  cliente: { id: number; nombre: string; telefono: string };
  detalles: DetalleWithProduct[];
}

export type OrderSummary = Pick<
  SelectPedido,
  "id" | "estado" | "total" | "fecha"
> & {
  cliente: Pick<SelectCliente, "id" | "nombre" | "telefono">;
  detalles: DetalleWithProduct[];
};
