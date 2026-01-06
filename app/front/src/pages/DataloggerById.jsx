import { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate, data } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import api from '../services/api';
import MiPieChart from '../components/graficos/MiPieChart.jsx';
import TablaSensores from '../components/TablaSensores.jsx';


export default function DataloggerById() {
  const { user } = useContext(AuthContext);
  const [datalogger, setDatalogger] = useState()
  const navigate = useNavigate();
  const { id_datalogger } = useParams();

  useEffect(() => {
    api.get(`/sensores/${id_datalogger}`)
      .then(res => {
        setDatalogger(res.data)
      })
      .catch(err => {
        console.error(err)
        alert("Error cargando datalogger")
        // navigate('/dataloggers')
      })
  }, [id_datalogger])

  const formaterFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    const formateada = fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formateada;
  }


  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        class="ml-8 flex items-center text-base font-semibold text-gray-500 outline-none hover:text-gray-900"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-sky-950">Nombre: {datalogger?.[0]?.datalogger?.nombre}</h2>
        <p className="text-lg font-medium text-sky-800">Ubicación: {datalogger?.[0]?.datalogger?.ubicacion}</p>
        <p className="text-lg font-medium text-sky-800">Número de Serie: {datalogger?.[0]?.datalogger?.numero_de_serie}</p>
        <MiPieChart datos={datalogger}/>
        <h3 className="text-2xl font-bold tracking-tight text-sky-900 mt-6">Sensores Asociados:</h3>  
        {datalogger ? <TablaSensores sensores={datalogger}/> : <p>Cargando sensores...</p>}
      </div>
    </div>
  )
}
