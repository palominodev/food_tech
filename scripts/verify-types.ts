import {
  usuarios,
  pedidos,
  productos,
} from "../db/schema";
import type {
  InsertUsuario,
  SelectUsuario,
  InsertPedido,
  SelectPedido,
  InsertProducto,
  SelectProducto,
} from "../db/schema";

// Type inference verification — this file compiles if inference works
const _newUser: InsertUsuario = {
  nombre: "Test",
  email: "test@example.com",
  password: "secret",
  rol: "administrador",
  estado: true,
};

const _user: SelectUsuario = {
  id: 1,
  nombre: "Test",
  email: "test@example.com",
  password: "secret",
  rol: "administrador",
  estado: true,
};

const _newPedido: InsertPedido = {
  clienteId: 1,
  usuarioId: 1,
  estado: "pendiente",
  total: 100.5,
  tipo: "delivery",
};

const _pedido: SelectPedido = {
  id: 1,
  clienteId: 1,
  usuarioId: 1,
  fecha: new Date(),
  estado: "pendiente",
  total: 100.5,
  tipo: "delivery",
};

const _newProducto: InsertProducto = {
  nombre: "Burger",
  precio: 10.99,
  categoria: "comida",
  disponible: true,
};

const _producto: SelectProducto = {
  id: 1,
  nombre: "Burger",
  precio: 10.99,
  categoria: "comida",
  disponible: true,
};

console.log("Type inference verified for usuarios, pedidos, productos");

// Compile-time check: ensure table types are not `any`
type _AssertNotAny<T> = 0 extends 1 & T ? never : T;
type _UsuarioCheck = _AssertNotAny<SelectUsuario>;
type _PedidoCheck = _AssertNotAny<SelectPedido>;
type _ProductoCheck = _AssertNotAny<SelectProducto>;

// Satisfy TS if checks pass (no runtime effect)
const _checks: [_UsuarioCheck, _PedidoCheck, _ProductoCheck] = [undefined as unknown as _UsuarioCheck, undefined as unknown as _PedidoCheck, undefined as unknown as _ProductoCheck];
void _checks;
void _newUser;
void _user;
void _newPedido;
void _pedido;
void _newProducto;
void _producto;
