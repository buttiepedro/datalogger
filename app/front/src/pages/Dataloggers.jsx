import { useEffect, useState } from "react"
import api from "../services/api"
import { useContext } from 'react'
import { AuthContext } from "../context/AuthContext";
import FormDatalogger from "../components/FormDatalogger.jsx"
import TablaDataloggers from "../components/TablaDataloggers.jsx";

export default function Dataloggers() {
  const { user } = useContext(AuthContext);
  const [dataloggers, setDataloggers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sensores, setSensores] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get("/dataloggers/")
      .then(res => {
        setDataloggers(res.data)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando dataloggers")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dataloggers.length])

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
      setErrorCrear({
        error: null, 
        state: false,
      })
    })
    .catch(err => {
      setError("Error creando datalogger")
    })
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
          className="mb-4 rounded-md bg-blue-900 py-2 px-4 text-base font-semibold text-white hover:bg-blue-800 "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-white hover:stroke-blue-900">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        </button>
      </div>
      <TablaDataloggers dataloggers={dataloggers} error={error} loading={loading} sensores={sensores} onEliminar={() => {}}></TablaDataloggers>
      {/* <ul className="space-y-2">
        {dataloggers.map(datalogger => (
          <li key={datalogger.id} className="border p-4 rounded shadow">
            <h2 className="text-2xl font-semibold">{datalogger.nombre}</h2>
            <p>Ubicación: {datalogger.ubicacion}</p>
            <p>Número de Serie: {datalogger.numero_de_serie}</p>
            { user.isSuperuser && <p>Empresa: {datalogger.empresa}</p> }
          </li>
        ))}
      </ul> */}
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