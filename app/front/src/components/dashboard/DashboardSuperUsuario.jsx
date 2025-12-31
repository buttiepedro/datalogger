import { useEffect,useState } from "react"
import api from "../../services/api"
import TableEmpresas from "./TablaEmpresas"
import TableUsuarios from "./TablaUsuarios"
import Pagination from "../Pagination"
import FormUsuarios from "./FormUsuarios"
import FormEmpresas from "./FormEmpresas"
import { useAuth } from "../../context/AuthContext"


export default function Dashboard() {
  // Estado para completar formulario de creacion de usuarios
  const { user } = useAuth()
  const [listEmpresas, setListEmpresas] = useState([])
  // Estados para tablas y paginacion
  const [empresas, setEmpresas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Estado para control de error en formulario de creacion
  const [errorCrearUsuario, setErrorCrearUsuario] = useState({
    error: null, 
    state: false,
  })
  const [showFormEmpresas, setShowFormEmpresas] = useState(false)
  const [showFormUsuarios, setShowFormUsuarios] = useState(false)
  const [usuariosPagination, setUsuariosPagination] = useState({
    current_page: 1,
    total_items: 0,
    total_pages: 0,
    per_page: 5
  })
  const [empresasPagination, setEmpresasPagination] = useState({
    current_page: 1,
    total_items: 0,
    total_pages: 0,
    per_page: 5
  })

  const getEmpresas = () => {
    api.get(`/empresas/?page=${empresasPagination.current_page}`)
      .then((res) => {
        // asignacion de datos para formulario
        setListEmpresas(res.data.empresas)
      })
      .catch((err) => {
        setError(err)
      })  
      .finally(() => {
        setLoading(false)
      })
    api.get(`/empresas/pagination?page=${empresasPagination.current_page}`)
      .then((res) => {
        // asignacion de datos para paginacion
        setEmpresas(res.data.empresas)
        setEmpresasPagination(res.data.pagination)
      }
      )
      .catch((err) => {
        setError(err)
      })  
      .finally(() => {
        setLoading(false)
      })
  }

  const getUsuarios = () => {
    api.get(`/usuarios/?page=${usuariosPagination.current_page}`)
      .then((res) => {
        // asignacion de datos para paginacion
        setUsuarios(res.data.usuarios)
        setUsuariosPagination(res.data.pagination)
        console.log(res.data)
      }
      )
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
}, [
  listEmpresas.length, 
  usuariosPagination.current_page, 
  empresasPagination.current_page,
  empresas.length,
  usuarios.length
])

  const crearUsuario = (e) => {
    e.preventDefault()
    const form = e.target
    const nuevoUsuario = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
      is_admin: form.is_admin.checked ,
      id_empresa: parseInt(form.empresa.value)
    }
    api.post("/usuarios/", nuevoUsuario)
      .then((res) => {
        setUsuarios([...usuarios, res.data])
        form.reset()
        setShowFormUsuarios(false)
        setErrorCrearUsuario({
          error: null, 
          state: false,
        })
      })
      .catch((err) => {
        console.error(err)
        setErrorCrearUsuario(err.response.data)
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
        handleShowFormEmpresas()
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

  const handlePageChange = (page,isEmpresas) => {
    if (!isEmpresas){
      setUsuariosPagination({
        ...usuariosPagination,
        current_page: page
      })
    }else{
      setEmpresasPagination({
        ...empresasPagination,
        current_page: page
      })
    }
  }

  const handleShowFormUsuarios = () => {
    console.log("click", showFormUsuarios)
    setShowFormUsuarios(!showFormUsuarios)
    //desactivar scroll de fondo
    window.scrollTo(0,0)
    document.body.style.overflow = showFormUsuarios ? "auto" : "hidden";
  }
  const handleShowFormEmpresas = () => {
    window.scrollTo(0,0)
    setShowFormEmpresas(!showFormEmpresas)
    document.body.style.overflow = showFormEmpresas ? "auto" : "hidden";
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
          onClick={handleShowFormUsuarios}
          className="mb-4 mx-2 rounded-md bg-blue-900 py-2 px-4 text-base font-semibold text-white hover:bg-blue-800 "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        </button>
        <button
          onClick={handleShowFormEmpresas}
          className="mb-4 mx-2 rounded-md bg-blue-900 py-2 px-4 text-base font-semibold text-white hover:bg-blue-800 "
        >
          <span className="flex relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={2.8} stroke="#FFFFFF" className="size-3 fill-white absolute top-1 -right-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ">
        <div className="overflow-auto">
          <h2>Lista de Usuarios</h2>
          <TableUsuarios onEliminar={eliminarUsuario} usuarios={usuarios} loading={loading} error={error} />
        </div>
        <Pagination 
          esEmpresas={false}
          currentPage={usuariosPagination.current_page} 
          totalItems={usuariosPagination.total_items} 
          totalPages={usuariosPagination.total_pages} 
          perPage={usuariosPagination.per_page}
          onPageChange={handlePageChange}
          >
        </Pagination>
        
        <div className="overflow-auto">
          <h2>Lista de Empresas</h2>
          <TableEmpresas onEliminar={eliminarEmpresa} empresas={empresas} loading={loading} error={error} />
        </div>
        <Pagination 
          esEmpresas={true}
          currentPage={empresasPagination.current_page} 
          totalItems={empresasPagination.total_items} 
          totalPages={empresasPagination.total_pages} 
          perPage={empresasPagination.per_page}
          onPageChange={handlePageChange}
          >
        </Pagination>
        <FormUsuarios empresas={listEmpresas} onSubmit={crearUsuario} superUsuario={user} showForm={showFormUsuarios} setShowForm={setShowFormUsuarios} error={errorCrearUsuario} setError={setErrorCrearUsuario} />
        <FormEmpresas onSubmit={crearEmpresa} showForm={showFormEmpresas} setShowForm={setShowFormEmpresas}  />
      </div>
    </>
  )
}
