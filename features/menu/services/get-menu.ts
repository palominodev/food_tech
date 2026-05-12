import { eq, asc } from "drizzle-orm";
import { db } from "@/db/client";
import { productos } from "@/db/schema/productos";
import { inventario } from "@/db/schema/inventario";
import type { MenuItem, MenuByCategory } from "../types";

export async function getMenu(): Promise<MenuItem[]> {
  const rows = await db
    .select()
    .from(productos)
    .where(eq(productos.disponible, true))
    .orderBy(asc(productos.categoria), asc(productos.nombre))
    .leftJoin(inventario, eq(productos.id, inventario.productoId));

  return rows.map((row) => ({
    ...row.productos,
    stock: row.inventario ?? undefined,
  }));
}

export function groupByCategory(items: MenuItem[]): MenuByCategory[] {
  const map = new Map<string, MenuItem[]>();

  for (const item of items) {
    const list = map.get(item.categoria) ?? [];
    list.push(item);
    map.set(item.categoria, list);
  }

  return Array.from(map.entries()).map(([categoria, items]) => ({
    categoria,
    items,
  }));
}
