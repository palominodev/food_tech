import { render, screen } from '@testing-library/react';
import ProductosPage from './page';
import { db } from '@/db/client';
import { vi, describe, it, expect, type Mock } from 'vitest';

vi.mock('@/db/client', () => ({
  db: {
    query: {
      productos: {
        findMany: vi.fn(),
      },
    },
  },
}));

vi.mock('./deactivate-button', () => ({
  default: () => <button>Desactivar</button>,
}));

vi.mock('./activate-button', () => ({
  default: () => <button>Activar</button>,
}));

describe('ProductosPage', () => {
  it('should render the product list including activate button for unavailable products', async () => {
    const mockProducts = [
      { id: 1, nombre: 'Pizza', precio: 15.5, categoria: 'Comida', disponible: true },
      { id: 2, nombre: 'Soda', precio: 2.0, categoria: 'Bebida', disponible: false },
    ];
    (db.query.productos.findMany as unknown as Mock).mockResolvedValue(mockProducts);

    render(await ProductosPage());

    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Desactivar')).toBeInTheDocument();
    expect(screen.getByText('Soda')).toBeInTheDocument();
    expect(screen.getByText('Activar')).toBeInTheDocument();
  });

  it('should show message if no products found', async () => {
    (db.query.productos.findMany as unknown as Mock).mockResolvedValue([]);

    render(await ProductosPage());

    expect(screen.getByText('No hay productos registrados.')).toBeInTheDocument();
  });
});
