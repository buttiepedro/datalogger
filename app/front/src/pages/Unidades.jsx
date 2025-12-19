import { useEffect, useState } from "react"
import api from "../services/api"

export default function Unidades() {
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
  }, [])

  const crearUnidad = (e) => {
    e.preventDefault()
    const form = e.target 
    const nuevaUnidad = {
      nombre: form.nombre.value,
      booleana: form.booleana.checked
    }

    api.post("/unidades/", nuevaUnidad)
      .then(res => {
        setUnidades([...unidades, res.data])
        form.reset()
      })
      .catch(err => {
        console.error(err)
        alert("Error creando unidad")
      })
  } 

  const eliminarUnidad = (id) => {
    api.delete(`/unidades/${id}`)
      .then(() => {
        setUnidades(unidades.filter(u => u.id !== id))
      })
      .catch(err => {
        console.error(err)
        alert("Error eliminando unidad")
      })
  }


  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <>
    <h1 className="text-2xl font-bold">
      Unidades
    </h1>
    <form onSubmit={crearUnidad}>
      <div className="mb-3">
        <label className="">Nombre (ej. °C)</label>
        <input name="nombre" className="px-2 py-2 bg-white rounded-md" required/>
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="booleana" name="booleana"/>
        <label className="" for="booleana">Booleana</label>
      </div>
      <button class="px-6 py-2 bg-blue-900 text-white rounded-md" type="submit">Crear Unidad</button>
    </form>
    <div className="mt-8">
      <h2>Lista de Unidades</h2>
      <ul className="space-y-2 mt-6">
        {unidades.map(unidad => (
          <li
            key={unidad.id}
            className="p-4  rounded shadow"
          >
            <p className="font-semibold">{unidad.nombre} {unidad.booleana ? "(Booleana)" : ""}</p>
            <button
              className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md"
              onClick={() => eliminarUnidad(unidad.id)} 
            >Eliminar</button>
          </li>
        ))}
      </ul>

    </div>
    </> 
  )
}