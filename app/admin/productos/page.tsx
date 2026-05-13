import { db } from '@/db/client';
import DeactivateProductButton from './deactivate-button';
import ActivateProductButton from './activate-button';
import Link from 'next/link';

export default async function ProductosPage() {
  const allProducts = await db.query.productos.findMany();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {allProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              allProducts.map((product) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">${product.precio}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.categoria}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.disponible ? 'Disponible' : 'No Disponible'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link href={`/admin/productos/${product.id}`} className="text-blue-600 hover:text-blue-900">
                        Editar
                      </Link>
                      {product.disponible ? (
                        <DeactivateProductButton id={product.id} />
                      ) : (
                        <ActivateProductButton id={product.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
