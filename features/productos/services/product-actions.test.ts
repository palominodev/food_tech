// @vitest-environment node
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createProduct, updateProduct, deactivateProduct, activateProduct } from './product-actions';
import { db } from '@/db/client';
import { productos } from '@/db/schema/productos';
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
      productos: {
        findMany: vi.fn(),
      },
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Product Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a product successfully', async () => {
    const productData = { nombre: 'Pizza', precio: 15.5, categoria: 'Comida' };
    const result = await createProduct(productData);

    expect(result.success).toBe(true);
    expect(db.insert).toHaveBeenCalledWith(productos);
    expect(revalidatePath).toHaveBeenCalledWith('/admin/productos');
  });

  it('should update a product successfully', async () => {
    const result = await updateProduct(1, { precio: 16.0 });

    expect(result.success).toBe(true);
    expect(db.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/admin/productos');
  });

  it('should deactivate a product successfully', async () => {
    const result = await deactivateProduct(1);

    expect(result.success).toBe(true);
    expect(db.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/admin/productos');
  });

  it('should activate a product successfully', async () => {
    const result = await activateProduct(1);

    expect(result.success).toBe(true);
    expect(db.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/admin/productos');
  });
});
