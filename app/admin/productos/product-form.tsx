'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, type ActionResponse } from '@/features/productos/services/product-actions';

interface ProductFormProps {
  product?: {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const [nombre, setNombre] = useState(product?.nombre || '');
  const [precio, setPrecio] = useState(product?.precio?.toString() || '');
  const [categoria, setCategoria] = useState(product?.categoria || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const priceNum = parseFloat(precio);
    if (isNaN(priceNum)) {
      setError('El precio debe ser un número válido');
      setIsLoading(false);
      return;
    }

    let result: ActionResponse;

    if (product) {
      result = await updateProduct(product.id, { nombre, precio: priceNum, categoria });
    } else {
      result = await createProduct({ nombre, precio: priceNum, categoria });
    }

    if (result.success) {
      router.push('/admin/productos');
    } else {
      setError(result.message || 'Error al procesar la solicitud');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
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
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            id="precio"
            type="number"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            id="categoria"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
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
            onClick={() => router.push('/admin/productos')}
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
