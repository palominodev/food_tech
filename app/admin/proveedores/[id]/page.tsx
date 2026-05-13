import { getProveedorById } from '@/features/proveedores/services/proveedor-actions';
import ProveedorForm from '../proveedor-form';
import { notFound } from 'next/navigation';

export default async function EditarProveedorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const proveedor = await getProveedorById(Number(id));

  if (!proveedor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Proveedor</h1>
      <ProveedorForm proveedor={proveedor} />
    </div>
  );
}
