import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from './user-form';
import { createUser } from '@/features/usuarios/services/user-actions';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('@/features/usuarios/services/user-actions', () => ({
  createUser: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('UserForm', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as Mock).mockReturnValue({ push: mockPush });
  });

  it('should render the create form', () => {
    render(<UserForm />);
    expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument();
  });

  it('should render the edit form with initial data', () => {
    const user = { id: 1, nombre: 'John', email: 'john@test.com', rol: 'mesero' as const };
    render(<UserForm user={user} />);
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@test.com')).toBeInTheDocument();
  });

  it('should call createUser on submit for new user', async () => {
    (createUser as unknown as Mock).mockResolvedValue({ success: true });
    render(<UserForm />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/Rol/i), { target: { value: 'cocinero' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/admin/usuarios');
    });
  });
});
