import { db } from '@/db/client';
import { productos } from '@/db/schema/productos';
import { eq } from 'drizzle-orm';
import ProductForm from '../product-form';
import { notFound } from 'next/navigation';

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.query.productos.findFirst({
    where: eq(productos.id, parseInt(id)),
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
      <ProductForm
        product={{
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          categoria: product.categoria,
        }}
      />
    </div>
  );
}
