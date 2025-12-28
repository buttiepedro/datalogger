import { useEffect,useState } from "react"
import api from "../../services/api"
import TablaUsuarios from "./TablaUsuarios"
import FormUsuarios from "./FormUsuarios"
import { useAuth } from "../../context/AuthContext"
import Pagination from "../Pagination"



export default function Dashboard() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usuariosPagination, setUsuariosPagination] = useState({
    current_page: 1,
    total_items: 0,
    total_pages: 0,
    per_page: 5
  })

  const getUsuarios = () => {
    api.get(`/usuarios/?page=${usuariosPagination.current_page}`)
      .then((res) => {
        setUsuarios(res.data.usuarios)
        setUsuariosPagination(res.data.pagination)
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
  }, [usuarios.length, usuariosPagination.current_page])

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
        alert("Error eliminando usuario")
      })
  }
  
  const handlePageChange = (page) => {
    setUsuariosPagination(() => ({
      ...usuariosPagination,
      current_page: page
    }))
    getUsuarios()
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
          <Pagination
            currentPage={usuariosPagination.current_page}
            totalPages={usuariosPagination.total_pages}
            totalItems={usuariosPagination.total_items}
            esEmpresa={false}
            onPageChange={handlePageChange}
          />

        </div>
        <FormUsuarios onSubmit={crearUsuario} superUsuario={user}/>
      </div>
    </>
  )
}
