import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from './product-form';
import { createProduct } from '@/features/productos/services/product-actions';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('@/features/productos/services/product-actions', () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('ProductForm', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as Mock).mockReturnValue({ push: mockPush });
  });

  it('should render the create form', () => {
    render(<ProductForm />);
    expect(screen.getByText('Crear Nuevo Producto')).toBeInTheDocument();
  });

  it('should render the edit form with initial data', () => {
    const product = { id: 1, nombre: 'Pizza', precio: 15.5, categoria: 'Comida' };
    render(<ProductForm product={product} />);
    expect(screen.getByText('Editar Producto')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pizza')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15.5')).toBeInTheDocument();
  });

  it('should call createProduct on submit for new product', async () => {
    (createProduct as unknown as Mock).mockResolvedValue({ success: true });
    render(<ProductForm />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'New Pizza' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '18.0' } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Comida' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/admin/productos');
    });
  });
});
