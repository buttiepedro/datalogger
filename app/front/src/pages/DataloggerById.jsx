import { useState, useContext, useEffect, use } from 'react'
import { useParams, useNavigate, data } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import api from '../services/api';
import MiPieChart from '../components/graficos/MiPieChart.jsx';
import MiGrafico from '../components/graficos/MiGrafico.jsx';
import TablaSensores from '../components/TablaSensores.jsx';
import Pagination from '../components/Pagination.jsx';
import FormSensor from '../components/FormSensor.jsx';


export default function DataloggerById() {
  const { user } = useContext(AuthContext);
  const [datalogger, setDatalogger] = useState()
  const [sensor, setSensor] = useState()
  const [numero_de_serie, setNumero_de_serie] = useState()
  const [sensoresPagination, setSensoresPagination] = useState({
    current_page: 1,
    total_items: 0,
    total_pages: 0,
    per_page: 5
  })
  const [selectedSensor, setSelectedSensor] = useState();
  const navigate = useNavigate();
  const { id_datalogger } = useParams();
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
  api.get(`/sensores/${id_datalogger}?page=${sensoresPagination.current_page}&per_page=${sensoresPagination.per_page}`)
    .then(res => {
      setDatalogger(res.data.sensores);
      // This will trigger the second useEffect once state updates
      setSelectedSensor(res.data.sensores[0]); 
      setSensoresPagination(res.data.pagination);
    })
    .catch(err => {
      alert("Error cargando datalogger");
    });
}, [id_datalogger, sensoresPagination.current_page]); // Only runs when datalogger ID changes

  useEffect(() => {
  // Only fetch if selectedSensor actually exists
  if (selectedSensor?.sensor_id) {
    getMediciones();
  }
}, [selectedSensor]); // Runs whenever selectedSensor is set or changed

const handlePageChange = (newPage) => {
  setSensoresPagination((prev) => ({
    ...prev,
    current_page: newPage,
  }));
}

  const getMediciones = () => {
    api.get(`/mediciones/sensor/${datalogger?.[0]?.datalogger?.numero_de_serie}/${selectedSensor.sensor_id}`)
    .then(res => {
      setSensor(res.data)
    })
    .catch(err => {
      alert("Error cargando sensor")
    })
  }

  const graficoSensor = (sensor) => {
    // Ordenar por hora ascendente
    sensor?.sort((a, b) => new Date(a.hora) - new Date(b.hora));
    const datosFormateados = sensor?.map(item => ({
    // coloca horarios aleatorios para probar el grafico
    hora: formaterHora(item.hora),
    medicion: item.medicion,
    titulo: selectedSensor ? `Mediciones del Sensor ${selectedSensor.sensor_id}` : 'Mediciones del Sensor',
    }));
    return datosFormateados;
  }

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
  const formaterHora = (fechaString) => {
    const fecha = new Date(fechaString);
    const formateada = fecha.toLocaleString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return formateada;
  }

  const handleShowForm = (e) => {
    window.scrollTo(0,0)
    setShowForm(!showForm)
    //desactivar scroll de fondo
    document.body.style.overflow = showForm ? "auto" : "hidden";
  }

  const crearSensor = (e) => {
    e.preventDefault()
    const form = e.target
    const nuevoSensor = {
      sensor_id: form.sensor_id.value,
      id_datalogger: id_datalogger,
      tipo_sensor: form.tipo_sensor.value,
    }
    api.post("/sensores/", nuevoSensor)
      .then((res) => {
        setDatalogger([...datalogger, res.data])
        form.reset()
        setShowForm(false)
        document.body.style.overflow = showForm ? "auto" : "hidden";
      })
      .catch((err) => {
        alert("Error creando sensor")
      })
  }

  const eliminarSensor = (id_sensor) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este sensor? Esta acción no se puede deshacer.");
    if (!confirmacion) {
      return; // Si el usuario no confirma, salir de la función
    }
    api.delete(`/sensores/${id_sensor}`)
      .then(() => {
        setDatalogger(datalogger.filter(s => s.id !== id_sensor))
      })
      .catch(err => {
        alert("Error eliminando sensor")
      })
  }


  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="ml-8 flex items-center text-base font-semibold text-gray-500 outline-none hover:text-gray-900"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-sky-950">Nombre: {datalogger?.[0]?.datalogger?.nombre}</h2>
        <p className="text-lg font-medium text-sky-800">Ubicación: {datalogger?.[0]?.datalogger?.ubicacion}</p>
        <p className="text-lg font-medium text-sky-800">Número de Serie: {datalogger?.[0]?.datalogger?.numero_de_serie}</p>
        <button
          onClick={handleShowForm}
          className="mb-4 mt-2 rounded-md bg-blue-900 py-2 px-4 text-base font-semibold text-white hover:bg-blue-800 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
        </button>
        <span className='flex'>
          <MiPieChart datos={datalogger}/>
          <MiGrafico mediciones={graficoSensor(sensor)}/>
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-sky-900 mt-6">Sensores Asociados:</h3>  
        {datalogger ? <TablaSensores sensores={datalogger} selectedSensor={selectedSensor} setSelectedSensor={setSelectedSensor} onEliminar={eliminarSensor}/> : <p>Cargando sensores...</p>}
        <Pagination
          currentPage={sensoresPagination.current_page}
          totalPages={sensoresPagination.total_pages}
          totalItems={sensoresPagination.total_items}
          esEmpresa={false}
          onPageChange={handlePageChange}
        />
      </div>
      <FormSensor onSubmit={crearSensor} showForm={showForm} setShowForm={setShowForm} datalogger={id_datalogger}/>
    </div>
  )
}
