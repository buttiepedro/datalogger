import { useEffect,useState } from "react"
import api from "../services/api"


export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [empresas, setEmpresas] = useState([])

  useEffect(() => {
    api.get("/usuarios/")
      .then((res) => {
        setUsuarios(res.data)
      })
      .catch((err) => {
        setError(err)
      })  
      .finally(() => {
        setLoading(false)
      })
    api.get("/empresas/")
      .then((res) => {
        setEmpresas(res.data)
      })
      .catch((err) => {
        setError(err)
      })  
      .finally(() => {
        setLoading(false)
      })
  }, [usuarios.length, empresas.length])

  const crearUsuario = (e) => {
    e.preventDefault()
    const form = e.target
    const nuevoUsuario = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
      is_admin: form.is_admin.value === "true",
      id_empresa: parseInt(form.empresa_id.value)
    }
    api.post("/usuarios/", nuevoUsuario)
      .then((res) => {
        setUsuarios([...usuarios, res.data])
        form.reset()
      })
      .catch((err) => {
        console.error(err)
        alert("Error creando usuario")
      })
  }

  const crearEmpresa = (e) => {
    e.preventDefault()
    const form = e.target
    const nuevaEmpresa = {
      nombre: form.nombre.value,
      direccion: form.direccion.value,
    }
    api.post("/empresas/", nuevaEmpresa)
      .then((res) => {
        setEmpresas([...empresas, res.data])
        form.reset()
      })
      .catch((err) => {
        console.error(err)
        alert("Error creando empresa")
      })  
  }

  const eliminarUsuario = (id) => {
    api.delete(`/usuarios/${id}`)
      .then(() => {
        setUsuarios(usuarios.filter(u => u.id !== id))
      })
      .catch(err => {
        console.error(err)
        alert("Error eliminando usuario")
      })
  }

  const eliminarEmpresa = (id) => {
    api.delete(`/empresas/${id}`)
      .then(() => {
        setEmpresas(empresas.filter(e => e.id !== id))
      })
      .catch(err => {
        console.error(err)
        alert("Error eliminando empresa")
      })
  }

  return (
    <>
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-sky-950">Dashboard</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h2>Lista de Usuarios</h2>
          <ul>
            {loading && <li>Cargando...</li>}
            {error && <li className="text-red-600">Error cargando usuarios</li>}
            {!loading && !error && usuarios.map((u) => (
              <div className="flex items-center gap-2" key={u.id}>
              <li key={u.id}>{u.nombre} - {u.is_admin ? "Admin" : "Usuario"} </li>
              <button onClick={() => eliminarUsuario(u.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
              </div>
            ))}
          </ul>
        </div>
        <div>
          <h2>Lista de Empresas</h2>
          <ul>
            {loading && <li>Cargando...</li>}
            {error && <li className="text-red-600">Error cargando empresas</li>}
            {!loading && !error && empresas.map((e) => (
              <div className="flex items-center gap-2" key={e.id}>
              <li key={e.id}>{e.nombre} - {e.direccion}</li>
              <button onClick={() => eliminarEmpresa(e.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
              </div>
            ))}
          </ul>
        </div>
        <form onSubmit={crearUsuario} className="mt-4">
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
              <select name="empresa_id" id="">
                {empresas.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
          </div>
          <div className="mb-3">
            <label className="inline-flex items-center">
              <label className="block mb-1" htmlFor="is_admin">Es admin?</label>
              <input className="ml-2" type="checkbox" id="is_admin" name="is_admin" value="true"/>
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Crear Usuario
          </button>
        </form>
        <form onSubmit={crearEmpresa} className="mt-4">
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
      </div>
    </>
  )
}
