export interface PaymentInput {
  pedidoId: number;
  metodo: string;
}

export interface PaymentResult {
  success: boolean;
  pagoId: number;
}
