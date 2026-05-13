'use server';

import { db } from '@/db/client';
import { productos, type InsertProducto } from '@/db/schema/productos';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  message?: string;
}

export async function createProduct(data: Omit<InsertProducto, 'id' | 'disponible'>): Promise<ActionResponse> {
  try {
    await db.insert(productos).values({
      ...data,
      disponible: true,
    });
    revalidatePath('/admin/productos');
    return { success: true };
  } catch {
    return { success: false, message: 'Error al crear el producto' };
  }
}

export async function updateProduct(id: number, data: Partial<Omit<InsertProducto, 'id'>>): Promise<ActionResponse> {
  try {
    await db.update(productos).set(data).where(eq(productos.id, id));
    revalidatePath('/admin/productos');
    return { success: true };
  } catch {
    return { success: false, message: 'Error al actualizar el producto' };
  }
}

export async function deactivateProduct(id: number): Promise<ActionResponse> {
  try {
    await db.update(productos).set({ disponible: false }).where(eq(productos.id, id));
    revalidatePath('/admin/productos');
    return { success: true };
  } catch {
    return { success: false, message: 'Error al desactivar el producto' };
  }
}

export async function activateProduct(id: number): Promise<ActionResponse> {
  try {
    await db.update(productos).set({ disponible: true }).where(eq(productos.id, id));
    revalidatePath('/admin/productos');
    return { success: true };
  } catch {
    return { success: false, message: 'Error al activar el producto' };
  }
}
