import { useEffect, useState } from "react"
import api from "../services/api"
import { useContext } from 'react'
import { AuthContext } from "../context/AuthContext";
import FormDatalogger from "../components/FormDatalogger.jsx"
import TablaDataloggers from "../components/TablaDataloggers.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Dataloggers() {
  const { user } = useContext(AuthContext);
  const [dataloggers, setDataloggers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sensores, setSensores] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [dataloggersPagination, setDataloggersPagination] = useState({
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    per_page: 5
  })

  useEffect(() => {
    api.get(`/dataloggers/?page=${dataloggersPagination.current_page}&per_page=${dataloggersPagination.per_page}`)
      .then(res => {
        setDataloggers(res.data.dataloggers)
        setDataloggersPagination(res.data.pagination)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando dataloggers")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dataloggers.length, dataloggersPagination.current_page])

  useEffect(() => {
    api.get("/sensores/")
      .then(res => {
        setSensores(res.data)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando sensores")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleShowForm = () => {
    setShowForm(!showForm)
    document.body.style.overflow = showForm ? "auto" : "hidden"
  }
  
  const crearDatalogger = (e) => {
    e.preventDefault()
    const form = e.target
    api.post("/dataloggers/", {
      nombre: form.nombre.value,
      ubicacion: form.ubicacion.value,
      numero_de_serie: form.numero_de_serie.value,
    })
    .then(res => {
      setDataloggers([...dataloggers, res.data])
      form.reset()
      setShowForm(false)
      setError(null)
    })
    .catch(err => {
      setError("Error creando datalogger")
    })
  }

  const elminiarDatalogger = (id_datalogger) => {
    api.delete(`/dataloggers/${id_datalogger}`)
      .then(res => {
        setDataloggers(dataloggers.filter(d => d.id !== id_datalogger))
      })
      .catch(err => {
        setError("Error eliminando datalogger")
      })
  }

  const handlePageChange = (newPage) => {
    setDataloggersPagination((prev) => ({
      ...prev,
      current_page: newPage,
    }));
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-sky-950">
            Dataloggers
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={handleShowForm}
          className="mb-4 rounded-md bg-blue-900 py-2 px-4 text-base font-semibold text-white hover:bg-blue-800 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-white hover:stroke-blue-900">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        </button>
      </div>
      <TablaDataloggers dataloggers={dataloggers} error={error} loading={loading} sensores={sensores} onEliminar={elminiarDatalogger}></TablaDataloggers>
      <Pagination
        currentPage={dataloggersPagination.current_page}
        totalPages={dataloggersPagination.total_pages}
        totalItems={dataloggersPagination.total_items}
        esEmpresa={false}
        onPageChange={handlePageChange}
      />
      <FormDatalogger
        superUsuario={user}
        showForm={showForm}
        setShowForm={setShowForm}
        error={{state: false, error: ''}}
        setError={() => {}}
        onSubmit={crearDatalogger}
      />
    </div>
  )
}