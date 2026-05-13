'use client';

import { activateProduct } from '@/features/productos/services/product-actions';

export default function ActivateProductButton({ id }: { id: number }) {
  const handleActivate = async () => {
    if (confirm('¿Estás seguro de que deseas habilitar este producto?')) {
      await activateProduct(id);
    }
  };

  return (
    <button
      onClick={handleActivate}
      className="text-green-600 hover:text-green-900"
    >
      Activar
    </button>
  );
}
