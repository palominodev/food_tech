# Plan: Casos de Uso de Administrador y Autenticación

## Resumen
Implementar la gestión base de Usuarios (UC_A1), Productos (UC_A2) y el Inicio de Sesión (UC_Login) requerida para la operativa del ERP.

## Tareas (Fases)

### Phase 1: Infrastructure & Auth Foundation
- Instalar dependencias: `jose`, `bcryptjs`.
- Crear `lib/auth/jwt.ts` y `lib/auth/hash.ts`.
- Crear `middleware.ts` para proteger `/admin/*`.

### Phase 2: Login Feature
- Crear `app/login/actions.ts` (loginUser, logoutUser).
- Crear `app/login/page.tsx` (Formulario de login).

### Phase 3: Admin Layout
- Crear `app/admin/layout.tsx` (Sidebar y validación de rol).

### Phase 4: Gestión de Usuarios (UC_A1)
- Crear Server Actions en `features/usuarios/services/user-actions.ts`.
- Crear vistas `app/admin/usuarios/page.tsx` y `user-form.tsx`.

### Phase 5: Gestión de Productos (UC_A2)
- Crear Server Actions en `features/productos/services/product-actions.ts`.
- Crear vistas `app/admin/productos/page.tsx` y `product-form.tsx`.

### Phase 6: Testing & Verification
- Escribir tests unitarios para jwt y hash (`lib/auth/*.test.ts`).
- Ejecutar linting y verificación de tipos.
