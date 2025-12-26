export default function FormUsuarios({empresas, onSubmit}) {
  return (
    <form onSubmit={onSubmit} className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Crear Nuevo Usuario</h2>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="nombre">Nombre:</label>
        <input className="border p-2 w-full" type="text" id="nombre" name="nombre" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="email">Correo:</label>
        <input className="border p-2 w-full" type="text" id="email" name="email" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="password">Contraseña:</label>
        <input className="border p-2 w-full" type="password" id="password" name="password" required />
      </div>
      <div>
          <label className="block mb-1" htmlFor="empresa_id">Empresa:</label>
          <select name="empresa_id" id="empresa_id" className="border p-2 w-full mb-3" required>
            {empresas.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
      </div>
      <div className="mb-3">
        <label className="inline-flex items-center">
          <label className="block mb-1" htmlFor="is_admin">Es admin?</label>
          <input className="ml-2" type="checkbox" id="is_admin" name="is_admin"/>
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Crear Usuario
      </button>
    </form>
  )
}