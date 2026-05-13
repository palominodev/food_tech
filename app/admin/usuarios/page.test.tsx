import { render, screen } from '@testing-library/react';
import UsuariosPage from './page';
import { db } from '@/db/client';
import { vi, describe, it, expect, type Mock } from 'vitest';

vi.mock('@/db/client', () => ({
  db: {
    query: {
      usuarios: {
        findMany: vi.fn(),
      },
    },
  },
}));

vi.mock('./deactivate-button', () => ({
  default: () => <button>Desactivar</button>,
}));

describe('UsuariosPage', () => {
  it('should render the user list', async () => {
    const mockUsers = [
      { id: 1, nombre: 'Admin User', email: 'admin@test.com', rol: 'administrador', estado: true },
      { id: 2, nombre: 'Mesero User', email: 'mesero@test.com', rol: 'mesero', estado: true },
    ];
    (db.query.usuarios.findMany as unknown as Mock).mockResolvedValue(mockUsers);

    render(await UsuariosPage());

    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Mesero User')).toBeInTheDocument();
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
  });

  it('should show message if no users found', async () => {
    (db.query.usuarios.findMany as unknown as Mock).mockResolvedValue([]);

    render(await UsuariosPage());

    expect(screen.getByText('No hay usuarios registrados.')).toBeInTheDocument();
  });
});
