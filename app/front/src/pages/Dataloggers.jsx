import { useEffect, useState } from "react"
import api from "../services/api"
import { useContext } from 'react'
import { AuthContext } from "../context/AuthContext";

export default function Dataloggers() {
  const { user } = useContext(AuthContext);
  const [dataloggers, setDataloggers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tiposSensores, setTiposSensores] = useState([])
  const [sensores, setSensores] = useState([])

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
    api.get("/tipo_sensor/")
      .then(res => {
        setTiposSensores(res.data)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando tipos de sensores")
      })
      .finally(() => {
        setLoading(false)
      })  
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

  
  const crearDatalogger = (e) => {
    e.preventDefault()
    const form = e.target
    api.post("/dataloggers/", {
      nombre: form.nombre.value,
      ubicacion: form.ubicacion.value,
      id_tipo: form.id_tipo.value,
      numero_de_serie: form.numero_de_serie.value
    })
    .then(res => {
      setDataloggers([...dataloggers, res.data])
    })
    .catch(err => {
      console.error(err)
      setError("Error creando datalogger")
    })
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Dataloggers</h1>

      <ul className="space-y-2">
        {dataloggers.map(datalogger => (
          <li key={datalogger.id} className="border p-4 rounded shadow">
            <h2 className="text-2xl font-semibold">{datalogger.nombre}</h2>
            <p>Ubicación: {datalogger.ubicacion}</p>
            <p>Número de Serie: {datalogger.numero_de_serie}</p>
            { user.isSuperuser && <p>Empresa: {datalogger.empresa}</p> }
          </li>
        ))}
      </ul>
      <form onSubmit={crearDatalogger} id="form-datalogger">
        <h2 className="text-xl font-semibold mb-2">Crear Nuevo Datalogger</h2>
        <div className="mb-3">
          <label className="block mb-1" htmlFor="nombre">Nombre:</label>
          <input className="border p-2 w-full" type="text" id="nombre" name="nombre" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1" htmlFor="ubicacion">Ubicacion:</label>
          <input className="border p-2 w-full" type="text" id="ubicacion" name="ubicacion" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1" htmlFor="numero_de_serie">Número de Serie:</label>
          <input className="border p-2 w-full" type="text" id="numero_de_serie" name="numero_de_serie" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Datalogger
        </button>
      </form>
    </div>
  )
}