import { db } from '@/db/client';
import { usuarios } from '@/db/schema/usuarios';
import { eq } from 'drizzle-orm';
import UserForm from '../user-form';
import { notFound } from 'next/navigation';
import type { JWTPayload } from '@/lib/auth/jwt';

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await db.query.usuarios.findFirst({
    where: eq(usuarios.id, parseInt(id)),
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Usuario</h1>
      <UserForm
        user={{
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol as JWTPayload['rol'],
        }}
      />
    </div>
  );
}
