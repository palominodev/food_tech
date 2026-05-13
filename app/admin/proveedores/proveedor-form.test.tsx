import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProveedorForm from "./proveedor-form";
import { createProveedor, updateProveedor } from "@/features/proveedores/services/proveedor-actions";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the actions
vi.mock("@/features/proveedores/services/proveedor-actions", () => ({
  createProveedor: vi.fn(),
  updateProveedor: vi.fn(),
}));

describe("ProveedorForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create form correctly", () => {
    render(<ProveedorForm />);
    expect(screen.getByText("Crear Nuevo Proveedor")).toBeInTheDocument();
  });

  it("submits create form successfully", async () => {
    (createProveedor as any).mockResolvedValue({ id: 1 });
    render(<ProveedorForm />);
    
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nuevo" } });
    fireEvent.change(screen.getByLabelText("Contacto"), { target: { value: "123" } });
    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(createProveedor).toHaveBeenCalledWith({ nombre: "Nuevo", contacto: "123" });
      expect(mockPush).toHaveBeenCalledWith("/admin/proveedores");
    });
  });

  it("shows error message on failure", async () => {
    (createProveedor as any).mockRejectedValue(new Error("Fail"));
    render(<ProveedorForm />);
    
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nuevo" } });
    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("Error al procesar la solicitud")).toBeInTheDocument();
    });
  });
});
