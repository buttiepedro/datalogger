import { useEffect,useState } from "react"
import api from "../../services/api"
import TableEmpresas from "./TablaEmpresas"
import TableUsuarios from "./TablaUsuarios"
import Pagination from "../Pagination"
import FormUsuarios from "./FormUsuarios"
import FormEmpresas from "./FormEmpresas"


export default function Dashboard() {
  // Estado para completar formulario de creacion de usuarios
  const [listEmpresas, setListEmpresas] = useState([])
  // Estados para tablas y paginacion
  const [empresas, setEmpresas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
        <FormUsuarios empresas={listEmpresas} onSubmit={crearUsuario} />
        <FormEmpresas onSubmit={crearEmpresa} />
      </div>
    </>
  )
}
