import type { SelectProducto } from "@/db/schema/productos";
import type { SelectInventario } from "@/db/schema/inventario";

export interface MenuItem extends SelectProducto {
  stock?: SelectInventario;
}

export interface MenuByCategory {
  categoria: string;
  items: MenuItem[];
}
