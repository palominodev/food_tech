// @vitest-environment node
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { loginUser, logoutUser } from './actions';
import { cookies } from 'next/headers';
import { db } from '@/db/client';
import { comparePassword } from '@/lib/auth/hash';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/db/client', () => ({
  db: {
    query: {
      usuarios: {
        findFirst: vi.fn(),
      },
    },
  },
}));

vi.mock('@/lib/auth/hash', () => ({
  comparePassword: vi.fn(),
}));

describe('Login Actions', () => {
  const mockCookies = {
    set: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as unknown as Mock).mockReturnValue(mockCookies);
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser = { id: 1, email: 'admin@test.com', password: 'hashed_password', rol: 'administrador', estado: true };
    (db.query.usuarios.findFirst as unknown as Mock).mockResolvedValue(mockUser);
    (comparePassword as unknown as Mock).mockResolvedValue(true);

    const result = await loginUser('admin@test.com', 'correct_password');

    expect(result.success).toBe(true);
    expect(mockCookies.set).toHaveBeenCalled();
  });

  it('should fail with invalid credentials', async () => {
    (db.query.usuarios.findFirst as unknown as Mock).mockResolvedValue(null);

    const result = await loginUser('wrong@test.com', 'any');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Credenciales inválidas');
    expect(mockCookies.set).not.toHaveBeenCalled();
  });

  it('should fail if user is inactive', async () => {
    const mockUser = { id: 1, email: 'admin@test.com', password: 'hashed_password', rol: 'administrador', estado: false };
    (db.query.usuarios.findFirst as unknown as Mock).mockResolvedValue(mockUser);
    (comparePassword as unknown as Mock).mockResolvedValue(true);

    const result = await loginUser('admin@test.com', 'password');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Cuenta desactivada');
  });

  it('should logout successfully', async () => {
    await logoutUser();
    expect(mockCookies.delete).toHaveBeenCalledWith('token');
  });
});
