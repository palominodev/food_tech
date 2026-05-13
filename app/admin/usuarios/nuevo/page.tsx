import UserForm from '../user-form';

export default function NuevoUsuarioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nuevo Usuario</h1>
      <UserForm />
    </div>
  );
}
