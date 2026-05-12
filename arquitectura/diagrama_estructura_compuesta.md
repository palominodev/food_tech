@startuml
left to right direction
skinparam monochrome true
skinparam shadowing false

title Diagrama de Estructura Compuesta - ERP Restaurante

rectangle "ERP Restaurante" {
    component "Gestión de Usuarios" as Usu {
        component "Control de Perfiles" as CP
        component "Roles (Adm/Mes/Coc/Caj)" as Roles
    }

    component "Gestión de Pedidos" as Ped {
        component "Pedido & Detalle" as PDet
        component "Asociación Cliente" as AC
    }

    component "Gestión de Pagos" as Pag {
        component "Transacción" as Tx
        component "Pasarela Externa" as PE
    }

    component "Gestión de Suministros" as Sum {
        component "Inventario & Productos" as InvP
        component "Órdenes de Compra" as OC
    }

    Usu --> Ped : "Mesero registra"
    Ped --> Pag : "genera cobro"
    Ped --> Sum : "descuenta stock"
    Sum --> Usu : "Adm. supervisa"
}
@enduml
