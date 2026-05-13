'use client';

import { deactivateUser } from '@/features/usuarios/services/user-actions';

export default function DeactivateUserButton({ id }: { id: number }) {
  const handleDeactivate = async () => {
    if (confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      await deactivateUser(id);
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
