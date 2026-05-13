import Link from 'next/link';
import { getProveedores, deleteProveedor } from '@/features/proveedores/services/proveedor-actions';
import { revalidatePath } from 'next/cache';

export default async function ProveedoresPage() {
  const proveedores = await getProveedores();

  async function handleDelete(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    await deleteProveedor(id);
    revalidatePath('/admin/proveedores');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
        <Link
          href="/admin/proveedores/nuevo"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo Proveedor
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contacto</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{p.nombre}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{p.contacto || '-'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link
                      href={`/admin/proveedores/${p.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {proveedores.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay proveedores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
