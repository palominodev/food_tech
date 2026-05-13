'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUser, type ActionResponse } from '@/features/usuarios/services/user-actions';
import type { JWTPayload } from '@/lib/auth/jwt';

interface UserFormProps {
  user?: {
    id: number;
    nombre: string;
    email: string;
    rol: 'administrador' | 'cajero' | 'cocinero' | 'mesero';
  };
}

export default function UserForm({ user }: UserFormProps) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(user?.rol || 'mesero');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let result: ActionResponse;

    if (user) {
      result = await updateUser(user.id, { nombre, email, rol });
    } else {
      result = await createUser({ nombre, email, password, rol });
    }

    if (result.success) {
      router.push('/admin/usuarios');
    } else {
      setError(result.message || 'Error al procesar la solicitud');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="nombre"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {!user && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            id="rol"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={rol}
            onChange={(e) => setRol(e.target.value as JWTPayload['rol'])}
          >
            <option value="administrador">Administrador</option>
            <option value="cajero">Cajero</option>
            <option value="cocinero">Cocinero</option>
            <option value="mesero">Mesero</option>
          </select>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/usuarios')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
