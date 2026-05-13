@startuml
skinparam ActivityBackgroundColor #5AABEC
skinparam ActivityBorderColor #2980C4
skinparam ActivityFontColor #042C53
skinparam ArrowColor #2980C4
skinparam shadowing false

title Diagrama de Interacción General - ERP Restaurante

start

:Cliente selecciona productos;

' --- ref: Diagrama de Secuencia "Toma de Pedido" ---
partition "ref: Secuencia — Toma de Pedido" {
  :Mesero → Sistema: registrarPedido();
  :Sistema → Inventario: verificarStock();

  if (¿Stock disponible?) then (no)
    :Sistema → Mesero: Error stock insuficiente;
    :Pedido cambia a **Cancelado**;
    stop
  else (sí)
    :Sistema → Inventario: actualizarStock(-cantidad);
    :Pedido cambia a **Registrado**;
  endif
}

' --- ref: Diagrama de Secuencia "Preparación" ---
partition "ref: Secuencia — Preparación en Cocina" {
  :Sistema → Cocinero: notificarNuevoPedido();
  :Cocinero → Sistema: actualizarEstado(En_Preparacion);
  :Cocinero prepara platillos;
  :Cocinero → Sistema: actualizarEstado(Listo);
}

' --- ref: Diagrama de Secuencia "Entrega" ---
partition "ref: Secuencia — Entrega" {
  :Sistema → Mesero: notificarPedidoListo();
  :Mesero → Cliente: entregarPedido();
  :Pedido cambia a **Entregado**;
}

' --- ref: Diagrama de Secuencia "Pago" ---
partition "ref: Secuencia — Pago" {
  :Cliente → Cajero: solicitarPago();
  :Cajero → Sistema: procesarPago(pedido);
  :Sistema → PasarelaPago: procesarPago(monto);

  if (¿Pago aprobado?) then (no)
    :Reintento de pago;
    :Sistema → PasarelaPago: procesarPago(monto);
  else (sí)
  endif

  :Pedido cambia a **Pagado**;
  :Cajero → Cliente: entregarComprobante();
}

' --- ref: Diagrama de Secuencia "Cierre" ---
partition "ref: Secuencia — Cierre" {
  fork
    :Sistema → Inventario: confirmarDescuentoStock();

    if (¿Stock bajo?) then (sí)
      :Sistema: generarOrdenCompra();
    else (no)
    endif
  fork again
    :Sistema: registrar cierre;
  end fork

  :Sistema: generarReporte(venta);
}

stop

note right
  Cada partición "ref:" representa
  una referencia a un fragmento
  del Diagrama de Secuencia.
  
  Los estados (Registrado, En_Preparacion,
  Listo, Entregado, Pagado, Cancelado)
  coinciden con el Diagrama de Estados.
end note

@enduml
