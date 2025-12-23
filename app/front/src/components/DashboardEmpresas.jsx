import { useEffect,useState } from "react"
import api from "../services/api"
import TablaUsuarios from "./TablaUsuarios"


export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [usuarios.length])

  const crearUsuario = (e) => {
    e.preventDefault()
    const form = e.target
    const nuevoUsuario = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
      is_admin: form.is_admin.checked,
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
  
  return (
    <>
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-sky-950">Dashboard</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-auto">
          <h2>Lista de Usuarios</h2>
          <TablaUsuarios usuarios={usuarios} loading={loading} error={error} onEliminar={eliminarUsuario}/>
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
      </div>
    </>
  )
}
