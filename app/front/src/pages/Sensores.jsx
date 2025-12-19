import { useEffect, useState } from "react"
import api from "../services/api"

export default function Sensores() {
  const [sensores, setSensores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get("/sensores")
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
  }, [sensores.length])

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Sensores</h1>

      <ul className="space-y-2">
        {sensores.map(sensor => (
          <li
            key={sensor.id}
            className="p-4 bg-black rounded shadow"
          >
            <p className="font-semibold">{sensor.nombre}</p>
            <p className="text-sm text-gray-600">{sensor.ubicacion}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}