'use server';

import { db } from "@/db/client";
import { proveedores, InsertProveedor } from "@/db/schema/proveedores";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from 'next/cache';

export async function getProveedores() {
  return await db.select().from(proveedores).orderBy(asc(proveedores.nombre));
}

export async function createProveedor(data: InsertProveedor) {
  const [result] = await db.insert(proveedores).values(data).returning();
  revalidatePath('/admin/proveedores');
  return result;
}

export async function getProveedorById(id: number) {
  const [result] = await db.select().from(proveedores).where(eq(proveedores.id, id));
  return result;
}

export async function updateProveedor(id: number, data: Partial<InsertProveedor>) {
  const [result] = await db.update(proveedores).set(data).where(eq(proveedores.id, id)).returning();
  revalidatePath('/admin/proveedores');
  return result;
}

export async function deleteProveedor(id: number) {
  const [result] = await db.delete(proveedores).where(eq(proveedores.id, id)).returning();
  revalidatePath('/admin/proveedores');
  return result;
}
