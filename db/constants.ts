export const PEDIDO_ESTADO = {
  Registrado: "Registrado",
  En_Preparacion: "En_Preparacion",
  Listo: "Listo",
  Entregado: "Entregado",
  Pagado: "Pagado",
  Cancelado: "Cancelado",
} as const;

export const PEDIDO_TIPO = {
  Local: "Local",
  Online: "Online",
  Para_LLevar: "Para_LLevar",
} as const;

export const PAGO_METODO = {
  Efectivo: "Efectivo",
  Tarjeta: "Tarjeta",
  Transferencia: "Transferencia",
  Mock: "Mock",
} as const;

export const PAGO_ESTADO = {
  Pendiente: "Pendiente",
  Completado: "Completado",
  Fallido: "Fallido",
} as const;

export const SYSTEM_USER_ID = 1;
