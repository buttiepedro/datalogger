import { useEffect,useState } from "react"
import api from "../services/api"
import TableEmpresas from "./TablaEmpresas"
import TableUsuarios from "./TablaUsuarios"


export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [empresas, setEmpresas] = useState([])


  const getEmpresas = () => {
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
  }

  const getUsuarios = () => {
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
  }
  
useEffect(() => {
  getUsuarios()
  getEmpresas()
}, [usuarios.length, empresas.length])

  const crearUsuario = (e) => {
    e.preventDefault()
    const form = e.target
    const nuevoUsuario = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
      is_admin: form.is_admin.checked ,
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
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.");
    if (!confirmacion) {
      return; // Si el usuario no confirma, salir de la función
    }
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
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta empresa? Esta acción no se puede deshacer.");
    if (!confirmacion) {
      return; // Si el usuario no confirma, salir de la función
    }
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ">
        <div className="overflow-auto">
          <h2>Lista de Usuarios</h2>
          <TableUsuarios onEliminar={eliminarUsuario} usuarios={usuarios} loading={loading} error={error} />
        </div>
        <div className="overflow-auto">
          <h2>Lista de Empresas</h2>
          <TableEmpresas onEliminar={eliminarEmpresa} empresas={empresas} loading={loading} error={error} />
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
