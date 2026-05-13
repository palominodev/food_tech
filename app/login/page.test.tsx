import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { loginUser } from './actions';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('./actions', () => ({
  loginUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('LoginPage', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as Mock).mockReturnValue({ push: mockPush });
  });

  it('should render the login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('should show error message on failed login', async () => {
    (loginUser as unknown as Mock).mockResolvedValue({ success: false, message: 'Credenciales inválidas' });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });

  it('should redirect on successful login', async () => {
    (loginUser as unknown as Mock).mockResolvedValue({ success: true });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/usuarios');
    });
  });
});
