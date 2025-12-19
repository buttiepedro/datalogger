import { useEffect, useState } from "react"
import api from "../services/api"

export default function Mediciones() {
  const [mediciones, setMediciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const crearMedicion = (e) => {
    e.preventDefault()
    const form = e.target 
    const nuevaMedicion = {
      usuario_id: form.usuario_id.value,
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
        <label class="form-label">Usuario ID</label>
        <input name="usuario_id" type="number" class="form-control" required/>
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
          className="p-4 bg-black rounded shadow">
          <p className="font-semibold">ID Usuario: {medicion.usuario_id}</p>
          <p className="text-sm text-gray-600">Medición: {medicion.medicion}</p>
        </li>
      ))}
    </ul>
    </>
  )
} 