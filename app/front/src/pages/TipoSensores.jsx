import { useEffect, useState } from "react"
import api from "../services/api"

export default function TipoSensores() {
  const [tiposSensores, setTiposSensores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unidades, setUnidades] = useState([])

  useEffect(() => {
    api.get("/tipo_sensor/")
      .then(res => {
        setTiposSensores(res.data)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando mediciones")
      })
      .finally(() => {
        setLoading(false)
      })
    api.get("/unidades/")
      .then(res => {
        setUnidades(res.data)
      })
      .catch(err => {
        console.error(err)
        setError("Error cargando unidades")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [tiposSensores.length])

  const crearTipoSensor = (e) => {

    e.preventDefault()
    const form = e.target
    const nuevoTipoSensor = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      id_unidad: form.unidad_id.value,
      medicion_min: form.medicion_min.value,
      medicion_max: form.medicion_max.value
    }
    api.post("/tipo_sensor/", nuevoTipoSensor)
      .then(res => {
        alert("Tipo de sensor creado con éxito")
        form.reset()
      })
      .catch(err => {
        console.error(err)
        alert("Error creando tipo de sensor")
      })  
  }

  return (
    <>
    <h1 className="text-2xl font-bold">
      Tipos de Sensores
    </h1>
    <form id="form-tipo-sensor" onSubmit={crearTipoSensor}>
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input name="nombre" class="form-control" required/>
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <input name="descripcion" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Unidad </label>
        <select name="unidad_id" id="">
          <option value="">Seleccione una unidad</option>
          {unidades.map(unidad => (
            <option value={unidad.id} key={unidad.id}>{unidad.nombre}</option>
          ))}
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Medición min</label>
        <input name="medicion_min" type="number" step="any" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Medición max</label>
        <input name="medicion_max" type="number" step="any" class="form-control"/>
      </div>
      <button class="px-6 py-2 bg-blue-900 text-white rounded-md" type="submit">Crear Tipo</button>
    </form>
    <div className="mt-8">
      <h2>Lista de Tipos de Sensores</h2>
      <ul className="space-y-2 mt-6">
        {tiposSensores.map(tipo => (
          <li
            key={tipo.id}
            className="p-4 bg-black rounded shadow"
          >
            <p className="font-semibold">{tipo.nombre}</p>
            <p className="text-sm text-gray-600">{tipo.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}