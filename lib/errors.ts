export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class StockInsufficientError extends AppError {
  constructor(productoId: number) {
    super(
      "STOCK_INSUFFICIENT",
      `Insufficient stock for product ${productoId}`,
      409
    );
    this.name = "StockInsufficientError";
  }
}

export class OrderAlreadyPaidError extends AppError {
  constructor() {
    super("ORDER_ALREADY_PAID", "Order is already paid", 409);
    this.name = "OrderAlreadyPaidError";
  }
}
