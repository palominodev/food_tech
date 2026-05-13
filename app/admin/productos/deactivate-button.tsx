'use client';

import { deactivateProduct } from '@/features/productos/services/product-actions';

export default function DeactivateProductButton({ id }: { id: number }) {
  const handleDeactivate = async () => {
    if (confirm('¿Estás seguro de que deseas marcar este producto como no disponible?')) {
      await deactivateProduct(id);
    }
  };

  return (
    <button
      onClick={handleDeactivate}
      className="text-red-600 hover:text-red-900"
    >
      Desactivar
    </button>
  );
}
