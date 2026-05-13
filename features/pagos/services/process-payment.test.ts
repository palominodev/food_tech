import { describe, it, expect, vi, beforeEach } from "vitest";
import { processPayment } from "./process-payment";
import { db } from "@/db/client";
import { pedidos } from "@/db/schema/pedidos";
import { pagos } from "@/db/schema/pagos";
import { PEDIDO_ESTADO } from "@/db/constants";
import { NotFoundError, OrderAlreadyPaidError, AppError } from "@/lib/errors";

vi.mock("@/db/client", () => ({
  db: {
    transaction: vi.fn(),
  },
}));

function getTableKey(table: unknown): string {
  if (table === pedidos) return "pedidos";
  if (table === pagos) return "pagos";
  return "unknown";
}

interface MockConfig {
  selectResults: Record<string, unknown[]>;
  insertResults: Record<string, unknown[]>;
}

function setupMockTransaction(config: MockConfig) {
  const mockTx = {
    select: vi.fn(() => ({
      from: vi.fn((table: unknown) => {
        const key = getTableKey(table);
        const data = config.selectResults[key] ?? [];
        return {
          where: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve(data)),
            then: (resolve: (value: unknown[]) => unknown) =>
              Promise.resolve(data).then(resolve),
          })),
          then: (resolve: (value: unknown[]) => unknown) =>
            Promise.resolve(data).then(resolve),
        };
      }),
    })),
    insert: vi.fn((table: unknown) => {
      const tableKey = getTableKey(table);
      return {
        values: vi.fn((_data: unknown) => {
          const result = config.insertResults[tableKey] ?? [];
          return {
            returning: vi.fn(() => Promise.resolve(result)),
            then: (resolve: (value: unknown) => unknown) =>
              Promise.resolve(undefined).then(resolve),
          };
        }),
      };
    }),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve(undefined)),
      })),
    })),
  };

  vi.mocked(db.transaction).mockImplementation(async (callback) => {
    return (callback as unknown as (tx: typeof mockTx) => Promise<unknown>)(
      mockTx
    );
  });

  return mockTx;
}

describe("processPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates payment and updates estado to Pagado (happy path)", async () => {
    setupMockTransaction({
      selectResults: {
        pedidos: [
          { id: 100, estado: PEDIDO_ESTADO.Registrado, total: 28.48 },
        ],
      },
      insertResults: {
        pagos: [
          {
            id: 50,
            pedidoId: 100,
            monto: 28.48,
            metodo: "Mock",
            estado: "Confirmado",
          },
        ],
      },
    });

    const result = await processPayment({ pedidoId: 100, metodo: "Mock" });

    expect(result.success).toBe(true);
    expect(result.pagoId).toBe(50);
  });

  it("throws OrderAlreadyPaidError when order is already paid", async () => {
    setupMockTransaction({
      selectResults: {
        pedidos: [
          { id: 100, estado: PEDIDO_ESTADO.Pagado, total: 28.48 },
        ],
      },
      insertResults: {},
    });

    await expect(
      processPayment({ pedidoId: 100, metodo: "Mock" })
    ).rejects.toBeInstanceOf(OrderAlreadyPaidError);
  });

  it("throws error when order is cancelled", async () => {
    setupMockTransaction({
      selectResults: {
        pedidos: [
          { id: 100, estado: PEDIDO_ESTADO.Cancelado, total: 28.48 },
        ],
      },
      insertResults: {},
    });

    await expect(
      processPayment({ pedidoId: 100, metodo: "Mock" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("throws NotFoundError when order does not exist", async () => {
    setupMockTransaction({
      selectResults: {
        pedidos: [],
      },
      insertResults: {},
    });

    await expect(
      processPayment({ pedidoId: 999, metodo: "Mock" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
