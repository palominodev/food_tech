import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import Link from 'next/link';
import LogoutButton from '@/components/auth/logout-button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <div className="p-8 text-center">Inicia sesión para acceder.</div>;
  }

  const payload = await verifyToken(token);

  if (!payload || payload.rol !== 'administrador') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="mt-2 text-gray-600">No tienes permisos para acceder a esta sección.</p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Panel de Administración</h2>
        <nav className="mt-8 space-y-2">
          <Link
            href="/admin/usuarios"
            className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Usuarios
          </Link>
          <Link
            href="/admin/productos"
            className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Productos
          </Link>
          <Link
            href="/admin/proveedores"
            className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Proveedores
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
