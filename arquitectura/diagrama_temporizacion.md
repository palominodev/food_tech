@startuml
@0
robust "Cliente" as C
robust "Mesero" as M
robust "Pedido" as P
robust "Cocina" as K
robust "Cajero" as CA
robust "Pago" as PG
robust "PasarelaPago" as PP
robust "Inventario" as INV
robust "Administrador" as ADM

C is En_Mesa
M is Inactivo
P is Sin_Pedido
K is Inactivo
CA is Inactivo
PG is Sin_Pago
PP is Inactivo
INV is Stock_OK
ADM is Inactivo

@1
C is Seleccionando
P is En_Carrito

@2
C is Confirmando
M is Registrando
P is Registrado

@3
C is Esperando
M is Notificando_Cocina
P is En_Preparacion
K is Preparando

@4
K is Actualizando_Estado

@5
K is Listo
P is Listo
M is Consultando_Estado

@6
C is Recibiendo
M is Entregando
P is Entregado
K is Inactivo

@7
C is Decidiendo

@8
C is Continuar_Pidiendo
P is Registrado
M is Registrando

@9
C is Esperando
P is En_Preparacion
K is Preparando

@10
C is Recibiendo
P is Entregado
K is Inactivo
M is Entregando

@11
C is Pagando
CA is Solicitando_Pago
PG is Procesando

@12
CA is Procesando_Pago
PP is Procesando_Digital

@13
PP is Confirmado
PG is Sin_Confirmar
CA is Emitiendo_Comprobante

@14
C is Finalizado
P is Pagado
PG is Confirmado
PP is Inactivo
CA is Inactivo
INV is Actualizando

@15
INV is Verificando

@16
INV is Stock_Bajo
ADM is Gestionando_Proveedor

@17
ADM is Generando_OrdenCompra
P is Cerrado

@18
INV is Stock_OK
ADM is Generando_Reporte

@19
C is Inactivo
M is Inactivo
PG is Sin_Pago
ADM is Inactivo
@enduml
