@startuml
left to right direction
skinparam packageStyle rectangle

actor "Cliente" as C
actor "Cajero" as CA
actor "Mesero" as M
actor "Cocinero" as CO
actor "Administrador" as A

actor "Pasarela de Pago" as PP <<Sistema Externo>>
actor "Proveedor" as PR <<Entidad Externa>>

rectangle "ERP Restaurante" {
    usecase "Iniciar Sesión / Logout" as UC_Login
    usecase "Ver menú" as UC_C0
    usecase "Realizar pedido" as UC_C1
    usecase "Consultar estado del pedido" as UC_C2
    usecase "Pagar pedido" as UC_C3
    usecase "Procesar pago" as UC_CA1
    usecase "Emitir comprobante" as UC_CA2
    usecase "Registrar pedido" as UC_M1
    usecase "Actualizar pedido" as UC_M2
    usecase "Actualizar stock" as UC_I1
    usecase "Ver pedidos" as UC_CO1
    usecase "Actualizar estado de preparación" as UC_CO2
    usecase "Gestionar inventario" as UC_A3
    usecase "Generar orden de compra" as UC_A7
    usecase "Gestionar proveedores" as UC_A4
    usecase "Gestionar productos" as UC_A2
    usecase "Generar reportes" as UC_A6
    usecase "Gestionar usuarios" as UC_A1
    usecase "Configurar sistema" as UC_A5
}

A --> UC_Login
M --> UC_Login
CO --> UC_Login
CA --> UC_Login

C --> UC_C0
C --> UC_C1
C --> UC_C2
C --> UC_C3
UC_C3 ..> UC_CA1 : <<include>>
CA --> UC_CA1
CA --> UC_CA2
UC_CA1 --> PP : envía datos

M --> UC_M1
M --> UC_M2
UC_M1 ..> UC_I1 : <<include>>
M --> UC_C2

CO --> UC_CO1
CO --> UC_CO2

A --> UC_A3
UC_A3 ..> UC_I1 : <<extend>>
A --> UC_A7
UC_A7 --> PR : envía orden
A --> UC_A4
A --> UC_A2
A --> UC_A6
A --> UC_A1
A --> UC_A5
@enduml
