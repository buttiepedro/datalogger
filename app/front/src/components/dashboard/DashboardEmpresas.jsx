import { use, useEffect,useState } from "react"
import api from "../../services/api"
import TablaUsuarios from "./TablaUsuarios"
import FormUsuarios from "./FormUsuarios"
import { useAuth } from "../../context/AuthContext"
import Pagination from "../Pagination"



export default function Dashboard() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [errorCrear, setErrorCrear] = useState({
    error: null, 
    state: false,
  })
  const [showForm, setShowForm] = useState(false)
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
        setShowForm(false)
        setErrorCrear({
          error: null, 
          state: false,
        })
      })
      .catch((err) => {
        setErrorCrear(err.response.data)
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

  const handleShowForm = (e) => {
    window.scrollTo(0,0)
    setShowForm(!showForm)
    //desactivar scroll de fondo
    document.body.style.overflow = showForm ? "auto" : "hidden";
  }

  return (
    <>
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-sky-950">Dashboard</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={handleShowForm}
          className="mb-4 rounded-md bg-blue-900 py-2 px-4 text-base font-semibold text-white hover:bg-blue-800 "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        </button>
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
        <FormUsuarios onSubmit={crearUsuario} superUsuario={user} showForm={showForm} error={errorCrear} setShowForm={setShowForm} setError={setErrorCrear}/>
      </div>
    </>
  )
}
