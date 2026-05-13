@startuml
skinparam monochrome true
skinparam shadowing false
skinparam ObjectBackgroundColor #5AABEC
skinparam ObjectBorderColor #2980C4
skinparam ObjectFontColor #042C53
skinparam ArrowColor #2980C4

' --- ESPACIADO ---
skinparam nodesep 100
skinparam ranksep 80

title Diagrama de Colaboración - Flujo Principal del Pedido

' --- OBJETOS ---
object ":Cliente" as C
object ":Mesero" as M
object ":Sistema" as S
object ":Cocinero" as CO
object ":Cajero" as CA
object ":Inventario" as I
object ":PasarelaPago" as PP

' --- DISTRIBUCIÓN ---
C -[hidden]right-- M
M -[hidden]right-- S
S -[hidden]right-- CO
CA -[hidden]right-- PP
S -[hidden]down-- I
S -[hidden]down-- CA

' --- MENSAJES NUMERADOS ---
C --> M : 1: seleccionarProductos()
M --> S : 2: registrarPedido(cliente, detalle[])
S --> I : 3: verificarStock(producto)
I --> S : 3.1: stockDisponible
S --> I : 4: actualizarStock(producto, -cantidad)
S --> M : 5: pedidoRegistrado(id, estado)
M --> C : 6: confirmarPedido()

S --> CO : 7: notificarNuevoPedido(pedido)
CO --> S : 8: actualizarEstado(pedido, En_Preparacion)
CO --> S : 9: actualizarEstado(pedido, Listo)
S --> M : 10: notificarPedidoListo(pedido)

M --> C : 11: entregarPedido()
M --> S : 12: actualizarEstado(pedido, Entregado)

C --> CA : 13: solicitarPago()
CA --> S : 14: procesarPago(pedido)
S --> PP : 15: procesarPago(monto, metodo)
PP --> S : 15.1: pagoConfirmado
S --> CA : 16: pagoExitoso()
CA --> S : 17: emitirComprobante(pago)
CA --> C : 18: entregarComprobante()

S --> S : 19: generarReporte(venta)

@enduml
