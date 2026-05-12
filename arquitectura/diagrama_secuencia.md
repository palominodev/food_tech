@startuml
skinparam SequenceParticipantBackgroundColor #5AABEC
skinparam SequenceParticipantBorderColor #2980C4
skinparam SequenceParticipantFontColor #042C53
skinparam SequenceLifeLineBorderColor #2980C4
skinparam SequenceArrowColor #2980C4
skinparam SequenceArrowFontSize 12
skinparam SequenceGroupBorderColor #2980C4
skinparam SequenceGroupBackgroundColor #E8F4FD
skinparam shadowing false

title Diagrama de Secuencia - Flujo Principal del Pedido

actor "Cliente" as C
participant "Mesero" as M
participant "Sistema" as S
participant "Cocinero" as CO
participant "Cajero" as CA
participant "Pasarela\nde Pago" as PP
participant "Inventario" as I

== Fase 1: Toma de Pedido ==

C -> M : Ver menú / Seleccionar productos
activate M
M -> S : registrarPedido(cliente, detalle[])
activate S
S -> S : crear Pedido (estado=Registrado)
S -> S : crear DetallePedido[]
S -> I : verificarStock(producto)
activate I
I --> S : stock disponible
deactivate I

alt Stock insuficiente
    S --> M : Error: stock insuficiente
    M --> C : Notificar falta de stock
    S -> S : cambiarEstado(Cancelado)
else Stock OK
    S -> I : actualizarStock(producto, -cantidad)
    activate I
    I --> S : stock actualizado
    deactivate I
    S --> M : pedido registrado (id, estado=Registrado)
    deactivate S
    M --> C : confirmación del pedido
    deactivate M
end

== Fase 2: Preparación en Cocina ==

S -> CO : notificarNuevoPedido(pedido)
activate CO
CO -> S : verPedidos()
S --> CO : lista pedidos (estado=Registrado)

CO -> S : actualizarEstado(pedido, En_Preparacion)
activate S
S -> S : cambiarEstado(En_Preparacion)
S --> CO : estado actualizado
deactivate S

CO -> CO : preparar platillos

CO -> S : actualizarEstado(pedido, Listo)
activate S
S -> S : cambiarEstado(Listo)
S --> CO : estado actualizado
deactivate S
deactivate CO

S -> M : notificarPedidoListo(pedido)
activate M

== Fase 3: Entrega ==

M -> C : entregar pedido
M -> S : actualizarEstado(pedido, Entregado)
activate S
S -> S : cambiarEstado(Entregado)
S --> M : estado actualizado
deactivate S
deactivate M

== Fase 4: Pago ==

C -> CA : solicitar pago
activate CA
CA -> S : procesarPago(pedido)
activate S
S -> PP : procesarPago(monto, metodo)
activate PP

alt Pago rechazado
    PP --> S : pago rechazado
    S --> CA : error en pago
    CA -> S : reintento procesarPago
    S -> PP : procesarPago(monto, metodo)
    PP --> S : pago confirmado
else Pago aprobado
    PP --> S : pago confirmado
end
note over S,PP : Nota: el flujo de reintento documenta una cardinalidad 1..* entre Pedido y Pago.\nEsto no contradice el diagrama de clases (1:1 en pago exitoso);\nel diagrama de secuencia modela los intentos de pago.

deactivate PP
S -> S : crear Pago (estado=Confirmado)
S -> S : cambiarEstado(Pedido, Pagado)
S --> CA : pago procesado
deactivate S

CA -> S : emitirComprobante(pago)
activate S
S --> CA : comprobante emitido
deactivate S
CA --> C : entregar comprobante
deactivate CA

== Fase 5: Cierre ==

par Actualizar inventario
    S -> I : actualizarStock(productos, -cantidades)
    activate I
    I --> S : stock actualizado
    deactivate I

    alt Stock bajo (stockActual < stockMinimo)
        S -> S : generarOrdenCompra(producto)
    end
else Cerrar pedido
    S -> S : registrar envío / cierre
end
note over S,I : Doble actualización de stock intencional:\n- Fase 1: reserva de stock al registrar pedido\n- Fase 5: confirmación de descuento al cerrar

S -> S : generarReporte(venta)

@enduml
