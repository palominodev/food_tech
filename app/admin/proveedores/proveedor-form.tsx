'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProveedor, updateProveedor } from '@/features/proveedores/services/proveedor-actions';

interface ProveedorFormProps {
  proveedor?: {
    id: number;
    nombre: string;
    contacto: string | null;
  };
}

export default function ProveedorForm({ proveedor }: ProveedorFormProps) {
  const [nombre, setNombre] = useState(proveedor?.nombre || '');
  const [contacto, setContacto] = useState(proveedor?.contacto || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (proveedor) {
        await updateProveedor(proveedor.id, { nombre, contacto });
      } else {
        await createProveedor({ nombre, contacto });
      }
      router.push('/admin/proveedores');
    } catch (err) {
      setError('Error al procesar la solicitud');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        {proveedor ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}
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
          <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">Contacto</label>
          <input
            id="contacto"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/proveedores')}
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
