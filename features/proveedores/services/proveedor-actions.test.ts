import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  getProveedores, 
  createProveedor, 
  getProveedorById, 
  updateProveedor, 
  deleteProveedor 
} from "./proveedor-actions";
import { db } from "@/db/client";

vi.mock("@/db/client", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(),
        orderBy: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

function mockQueryResult(data: unknown[]) {
  const where = vi.fn().mockResolvedValue(data);
  const orderBy = vi.fn().mockResolvedValue(data);
  const from = vi.fn(() => ({ where, orderBy }));

  (db.select as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    from,
  }));
}

function mockInsertResult(data: unknown) {
  const returning = vi.fn().mockResolvedValue([data]);
  const values = vi.fn(() => ({ returning }));

  (db.insert as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    values,
  }));
}

function mockUpdateResult(data: unknown) {
  const returning = vi.fn().mockResolvedValue([data]);
  const where = vi.fn(() => ({ returning }));
  const set = vi.fn(() => ({ where }));

  (db.update as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    set,
  }));
}

function mockDeleteResult(data: unknown) {
  const returning = vi.fn().mockResolvedValue([data]);
  const where = vi.fn(() => ({ returning }));

  (db.delete as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    where,
  }));
}

describe("getProveedores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a list of suppliers", async () => {
    mockQueryResult([
      { id: 1, nombre: "Proveedor A", contacto: "123456" },
      { id: 2, nombre: "Proveedor B", contacto: "789012" },
    ]);

    const result = await getProveedores();

    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe("Proveedor A");
  });

  it("returns empty array when no suppliers", async () => {
    mockQueryResult([]);

    const result = await getProveedores();

    expect(result).toEqual([]);
  });
});

describe("createProveedor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new supplier", async () => {
    const newProveedor = { nombre: "Nuevo Proveedor", contacto: "999999" };
    mockInsertResult({ id: 3, ...newProveedor });

    const result = await createProveedor(newProveedor);

    expect(result.id).toBe(3);
    expect(result.nombre).toBe("Nuevo Proveedor");
    expect(db.insert).toHaveBeenCalled();
  });
});

describe("getProveedorById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a supplier by ID", async () => {
    mockQueryResult([{ id: 1, nombre: "Proveedor A", contacto: "123456" }]);

    const result = await getProveedorById(1);

    expect(result?.id).toBe(1);
    expect(result?.nombre).toBe("Proveedor A");
  });

  it("returns undefined if supplier not found", async () => {
    mockQueryResult([]);

    const result = await getProveedorById(99);

    expect(result).toBeUndefined();
  });
});

describe("updateProveedor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates an existing supplier", async () => {
    const updatedData = { nombre: "Nombre Actualizado" };
    mockUpdateResult({ id: 1, ...updatedData, contacto: "123456" });

    const result = await updateProveedor(1, updatedData);

    expect(result.id).toBe(1);
    expect(result.nombre).toBe("Nombre Actualizado");
    expect(db.update).toHaveBeenCalled();
  });
});

describe("deleteProveedor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a supplier", async () => {
    mockDeleteResult({ id: 1 });

    const result = await deleteProveedor(1);

    expect(result.id).toBe(1);
    expect(db.delete).toHaveBeenCalled();
  });
});
