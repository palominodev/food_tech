'use server';

import { db } from '@/db/client';
import { usuarios, type InsertUsuario } from '@/db/schema/usuarios';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/hash';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  message?: string;
}

export async function createUser(data: Omit<InsertUsuario, 'id' | 'estado'>): Promise<ActionResponse> {
  try {
    const hashedPassword = await hashPassword(data.password);
    await db.insert(usuarios).values({
      ...data,
      password: hashedPassword,
      estado: true,
    });
    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('UNIQUE constraint failed')) {
      return { success: false, message: 'El email ya está en uso' };
    }
    return { success: false, message: 'Error al crear el usuario' };
  }
}

export async function updateUser(id: number, data: Partial<Omit<InsertUsuario, 'id' | 'password'>>): Promise<ActionResponse> {
  try {
    await db.update(usuarios).set(data).where(eq(usuarios.id, id));
    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch {
    return { success: false, message: 'Error al actualizar el usuario' };
  }
}

export async function deactivateUser(id: number): Promise<ActionResponse> {
  try {
    await db.update(usuarios).set({ estado: false }).where(eq(usuarios.id, id));
    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch {
    return { success: false, message: 'Error al desactivar el usuario' };
  }
}
