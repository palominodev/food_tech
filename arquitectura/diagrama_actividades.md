@startuml
skinparam ActivityBackgroundColor #5AABEC
skinparam ActivityBorderColor #2980C4
skinparam ActivityFontColor #042C53
skinparam ActivityFontSize 13
skinparam ArrowColor #2980C4
skinparam DiamondBackgroundColor #FFFFFF
skinparam DiamondBorderColor #2980C4
skinparam DiamondFontSize 11
skinparam ActivityDiamondFontColor #042C53
skinparam shadowing false

|Cliente|
start

|Cliente|
:Iniciar sesión;

if (¿Autenticado?) then (no)
  |Cliente|
  :Registrarse;
else (sí)
endif

|Cliente|
:Ver menú / catálogo;
:Seleccionar productos;

|Mesero|
:Registrar pedido;
:Asociar cliente;
:Agregar detalle pedido;

fork
  |Cocinero|
  :Ver pedido en cocina;
  :Preparar platillos;
  repeat
    :Actualizar estado;
  repeat while (¿Listo?) is (no)
  ->sí;
  :Notificar listo;
fork again
  |Mesero|
  :Entregar pedido;
end fork

|Cliente|
if (¿Finalizar compra?) then (no)
  :Continuar pidiendo;
  |Cliente|
  :Ver menú / catálogo;
  :Seleccionar productos;
  |Mesero|
  :Registrar pedido;
  :Asociar cliente;
  :Agregar detalle pedido;
else (sí)
  |Cajero|
  :Proceder al pago;
  if (¿Método de pago?) then (Efectivo)
  else (Digital)
  endif
  :Procesar pago;
  if (¿Confirmado?) then (no)
    :Procesar pago;
  else (sí)
  endif
  :Emitir comprobante;

  fork
    |Mesero|
    :Confirmar envío / cierre;
  fork again
    |Administrador|
    :Actualizar inventario;
    if (¿Stock bajo?) then (sí)
      :Generar orden de compra;
    else (no)
    endif
    :Generar reporte;
  end fork
endif

stop
@enduml
