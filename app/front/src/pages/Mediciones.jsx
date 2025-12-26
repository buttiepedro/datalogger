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
        console.log(res.data)
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
  }, [])

  const crearMedicion = (e) => {
    e.preventDefault()
    const form = e.target 
    const nuevaMedicion = {
      id_sensor: form.sensor_id.value,
      numero_de_serie: form.numero_de_serie.value,
      medicion: form.medicion.value
    }

    api.post("/mediciones/", nuevaMedicion)
      .then(res => {
        setMediciones([...mediciones, res.data])
        form.reset()
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
      <div class="mb-3">
        <label class="form-label">Sensor ID</label>
        <input name="sensor_id" type="number" class="form-control" required/>
      </div>
      <div class="mb-3">
        <label class="form-label">Número de Serie del Datalogger</label>
        <select name="numero_de_serie" class="form-select mb-3" required>
          <option value="">Seleccione un Datalogger</option>
          {dataloggers.map(datalogger => (
            <option key={datalogger.id} value={datalogger.numero_de_serie}>
              {datalogger.numero_de_serie}
            </option>
          ))}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Medición</label>
        <input name="medicion" type="number" step="any" class="form-control" required/>
      </div>
       <button class="px-6 py-2 bg-blue-900 text-white rounded-md" type="submit">Crear Medicion</button>
    </form>
    <ul className="mt-6 space-y-2">
      {mediciones.map(medicion => (
        <li
          key={medicion.id}
          className="p-4 rounded shadow">
          <p className="font-semibold">Sensor ID: {medicion.id_sensor}</p>
          <p className="font-semibold">Numero de serie: {medicion.datalogger.numero_de_serie}</p>
          <p className="text-sm text-gray-600">Medición: {medicion.medicion}</p>
        </li>
      ))}
    </ul>
    </>
  )
} 