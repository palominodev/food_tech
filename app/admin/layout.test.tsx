import { render, screen } from '@testing-library/react';
import AdminLayout from './layout';
import { cookies } from 'next/headers';
import { verifyToken, type JWTPayload } from '@/lib/auth/jwt';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/components/auth/logout-button', () => ({
  default: () => <button>Logout</button>,
}));

describe('AdminLayout', () => {
  const mockCookies = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as unknown as Mock).mockReturnValue(mockCookies);
  });

  it('should render the sidebar and children for valid administrator', async () => {
    mockCookies.get.mockReturnValue({ value: 'valid_token' });
    (verifyToken as unknown as Mock).mockResolvedValue({ id: 1, rol: 'administrador' } as JWTPayload);

    render(
      await AdminLayout({ children: <div data-testid="child">Content</div> })
    );

    expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should show unauthorized if rol is not administrador', async () => {
    mockCookies.get.mockReturnValue({ value: 'valid_token' });
    (verifyToken as unknown as Mock).mockResolvedValue({ id: 2, rol: 'mesero' } as JWTPayload);

    render(
      await AdminLayout({ children: <div>Content</div> })
    );

    expect(screen.getByText(/No tienes permisos para acceder a esta sección/i)).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });
});
