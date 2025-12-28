export default function FormEmpresas({onSubmit}) {
  return (
    <form onSubmit={onSubmit} className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Crear Nueva Empresa</h2>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="nombre">Nombre:</label>
        <input className="border p-2 w-full" type="text" id="nombre" name="nombre" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="direccion">Dirección:</label>
        <input className="border p-2 w-full" type="text" id="direccion" name="direccion" required />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Crear Empresa
      </button>
    </form>
  )
}