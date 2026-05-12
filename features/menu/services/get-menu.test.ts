import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMenu, groupByCategory } from "./get-menu";
import { db } from "@/db/client";

vi.mock("@/db/client", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            leftJoin: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

function mockQueryResult(data: unknown[]) {
  const leftJoin = vi.fn().mockResolvedValue(data);
  const orderBy = vi.fn(() => ({ leftJoin }));
  const where = vi.fn(() => ({ orderBy, leftJoin }));
  const from = vi.fn(() => ({ where, orderBy, leftJoin }));

  (db.select as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    from,
    where,
    orderBy,
    leftJoin,
  }));
}

describe("getMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns only available products", async () => {
    mockQueryResult([
      {
        productos: {
          id: 1,
          nombre: "Burger",
          precio: 12.99,
          categoria: "Platos Principales",
          disponible: true,
        },
        inventario: null,
      },
    ]);

    const result = await getMenu();

    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe("Burger");
    expect(result[0].disponible).toBe(true);
  });

  it("returns empty array when no products", async () => {
    mockQueryResult([]);

    const result = await getMenu();

    expect(result).toEqual([]);
  });
});

describe("groupByCategory", () => {
  it("groups items by categoria", () => {
    const items = [
      { id: 1, nombre: "Burger", precio: 12.99, categoria: "Platos Principales", disponible: true },
      { id: 2, nombre: "Pasta", precio: 14.5, categoria: "Platos Principales", disponible: true },
      { id: 3, nombre: "Cola", precio: 2.5, categoria: "Bebidas", disponible: true },
    ];

    const grouped = groupByCategory(items);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].categoria).toBe("Platos Principales");
    expect(grouped[0].items).toHaveLength(2);
    expect(grouped[1].categoria).toBe("Bebidas");
    expect(grouped[1].items).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
