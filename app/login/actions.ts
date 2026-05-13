'use server';

import { cookies } from 'next/headers';
import { db } from '@/db/client';
import { usuarios } from '@/db/schema/usuarios';
import { eq } from 'drizzle-orm';
import { comparePassword } from '@/lib/auth/hash';
import { signToken } from '@/lib/auth/jwt';

export interface ActionResponse {
  success: boolean;
  message?: string;
}

export async function loginUser(email: string, password: string): Promise<ActionResponse> {
  const user = await db.query.usuarios.findFirst({
    where: eq(usuarios.email, email),
  });

  if (!user) {
    return { success: false, message: 'Credenciales inválidas' };
  }

  if (!user.estado) {
    return { success: false, message: 'Cuenta desactivada' };
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    return { success: false, message: 'Credenciales inválidas' };
  }

  const token = await signToken({ id: user.id, rol: user.rol as JWTPayload['rol'] });

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });

  return { success: true };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
