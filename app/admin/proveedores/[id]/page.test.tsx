import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditarProveedorPage from "./page";
import { getProveedorById } from "@/features/proveedores/services/proveedor-actions";

// Mock the actions
vi.mock("@/features/proveedores/services/proveedor-actions", () => ({
  getProveedorById: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("EditarProveedorPage", () => {
  it("renders correctly with provider data", async () => {
    const mockProveedor = { id: 1, nombre: "Proveedor Test", contacto: "123" };
    vi.mocked(getProveedorById).mockResolvedValue(mockProveedor);

    const params = Promise.resolve({ id: "1" });
    const Page = await EditarProveedorPage({ params });
    render(Page);

    expect(screen.getAllByText("Editar Proveedor").length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue("Proveedor Test")).toBeInTheDocument();
  });
});
