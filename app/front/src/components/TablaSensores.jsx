import Spiner from "./Spiner";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
  
export default function TablaSensores({ sensores, error, loading}){
  const { user } = useContext(AuthContext);
  // const [sensoresData, setSensoresData] = useState(sensores);

  

  return (
    <>
    <table className="min-w-full divide-y divide-gray-200 ">
      <thead className="bg-gray-50 ">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID 
          </th>
          { user.isSuperuser ? 
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Empresa 
          </th> 
          : ''}
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Sensor ID 
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tipo Sensor
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ultima Medicion
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fecha Ultima Medicion
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading && (
          <tr>
            <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Spiner/>
            </td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
              Error cargando Usuarios
            </td>
          </tr>
        )}
        {sensores?.length === 0 && (
          <tr>
            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
              Todavia no existen usuarios
            </td>
          </tr>
        )}
        {sensores?.map((e) => (
          <tr key={e.id}  className="animate-fade-down animate-duration-300 cursor-pointer hover:bg-gray-200 transition duration-300" >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.id}</td>
            { user.isSuperuser ? 
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.datalogger.empresa}</td> 
            : ''}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.sensor_id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.tipo_sensor.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.ultima_medicion ? e.ultima_medicion.medicion + ' ' + e.tipo_sensor.id_unidad : 'No hay mediciones disponibles'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.ultima_medicion ? new Date(e.ultima_medicion.hora).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) : ''}</td>
          </tr>
        ))}
        
      </tbody>
    </table>
    </>
  )
}