import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function FormSensor({onSubmit, showForm, setShowForm}) {

  const resetForm = (e) => {
    const form = document.getElementById("close-buttonEmpresa").closest("form");
    form.reset();
  }
  const [tipoSensores, setTipoSensores] = useState([])

  useEffect(() => {
    api.get("/tipo_sensor/")
      .then((res) => {  
        setTipoSensores(res.data)
      }
      )
      .catch((err) => {
        alert("Error cargando tipos de sensores")
      })
  }, [])

  return (
     <div className={`${showForm ? 'flex' : 'hidden'} absolute top-0 left-0 items-center justify-center p-12 w-screen h-screen bg-gray-900/50`}>
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="relative z-20">
          <div className="absolute right-0">
            <button onClick={() => (resetForm(), setShowForm(!showForm), document.body.style.overflow = showForm ? "auto" : "hidden")} id="close-buttonEmpresa" type="button" className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-5">
            <label
              htmlFor="sensor_id"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Sensor ID
            </label>
            <input
              type="text"
              name="sensor_id"
              id="sensor_id"
              required
              placeholder="Sensor ID"
              className="focus:invalid:border-red-500 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="tipo_sensor"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Tipo de Sensor
            </label>
            <select
              name="tipo_sensor"
              id="tipo_sensor"
              required
              className="focus:invalid:border-red-500 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md"
            >
              <option value="Seleccione un tipo de sensor" disabled>Seleccione un tipo de sensor</option>
              {tipoSensores?.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="hover:shadow-form rounded-md bg-blue-900 py-3 px-8 text-base font-semibold text-white outline-none hover:bg-blue-800 cursor-pointer"
            >
              Crear Sensor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}