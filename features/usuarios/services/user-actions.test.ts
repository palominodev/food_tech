// @vitest-environment node
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createUser, updateUser, deactivateUser } from './user-actions';
import { db } from '@/db/client';
import { usuarios } from '@/db/schema/usuarios';
import { hashPassword } from '@/lib/auth/hash';
import { revalidatePath } from 'next/cache';

vi.mock('@/db/client', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue({}),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue({}),
      })),
    })),
    query: {
      usuarios: {
        findMany: vi.fn(),
      },
    },
  },
}));

vi.mock('@/lib/auth/hash', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('User Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const userData = { nombre: 'John Doe', email: 'john@test.com', password: 'password123', rol: 'mesero' as const };
    const result = await createUser(userData);

    expect(result.success).toBe(true);
    expect(hashPassword).toHaveBeenCalledWith('password123');
    expect(db.insert).toHaveBeenCalledWith(usuarios);
    expect(revalidatePath).toHaveBeenCalledWith('/admin/usuarios');
  });

  it('should update a user successfully', async () => {
    const result = await updateUser(1, { nombre: 'John Updated' });

    expect(result.success).toBe(true);
    expect(db.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/admin/usuarios');
  });

  it('should deactivate a user successfully', async () => {
    const result = await deactivateUser(1);

    expect(result.success).toBe(true);
    expect(db.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/admin/usuarios');
  });
});
