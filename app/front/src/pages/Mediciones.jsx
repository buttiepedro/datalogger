import { useEffect, useState } from "react"
import api from "../services/api"

export default function Mediciones() {
  const [mediciones, setMediciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataloggers, setDataloggers] = useState([])

  useEffect(() => {
    api.get("/mediciones/")
      .then(res => {
        setMediciones(res.data)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando mediciones")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [mediciones.length])

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

  const crearMedicion = (e) => {
    e.preventDefault()
    const form = e.target 
    const nuevaMedicion = {
      id_sensor: form.id_sensor.value,
      numero_de_serie: form.numero_de_serie.value,
      medicion: form.medicion.value
    }
    api.post("/mediciones/", nuevaMedicion)
      .then(res => {
        setMediciones([...mediciones, res.data])
      })
      .catch(err => {
        console.error(err)
        alert("Error creando medicion")
      })
  }



  return (
    <>
    <h1 className="text-2xl font-bold">
      Mediciones
    </h1>
    <form id="form-medicion" className="" onSubmit={crearMedicion}>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="id_sensor">Sensor ID:</label>
        <input className="border p-2 w-full" type="text" id="id_sensor" name="id_sensor" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="numero_de_serie">Datalogger ID:</label>
        <select name="numero_de_serie" className="form-select mb-3" required>
          <option>Seleccione un Datalogger</option>
          {dataloggers.map(datalogger => (
            <option key={datalogger.id} value={datalogger.numero_de_serie}>
              {datalogger.nombre} - {datalogger.numero_de_serie}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1" htmlFor="medicion">Medicion:</label>
        <input className="border p-2 w-full" type="text" id="medicion" name="medicion" required />
      </div>
      <button className="px-6 py-2 bg-blue-900 text-white rounded-md" type="submit">Crear Medicion</button>
    </form>
    <ul className="mt-6 space-y-2">
      {mediciones.map(medicion => (
        <>
        {loading ? (
          <p>Cargando mediciones...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
        <li
          key={medicion.id}
          className="p-4 rounded shadow">
          <p className="font-semibold">Sensor ID: {medicion.id_sensor}</p>
          <p className="font-semibold">Numero de serie: {medicion.datalogger.numero_de_serie}</p>
          <p className="text-sm text-gray-600">Medición: {medicion.medicion}</p>
        </li>
        )}
        </>
      ))}
    </ul>
    </>
  )
} 