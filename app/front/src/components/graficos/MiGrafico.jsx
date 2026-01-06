import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label } from 'recharts';

export default function GraficoPrueba({datos, max, min, mediciones}) {
  console.log("mediciones en MiGrafico:", mediciones);
  return (
    // Usamos Tailwind para dar estilo al contenedor (fondo, bordes, sombra)
    <div className="p-4  rounded-xl  w-full h-80">
       <ResponsiveContainer width="100%" height={"100%"}>
        <LineChart 
          data={mediciones} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }} // Evita que se corten etiquetas
        >
          {/* Titulo del sensor con padding*/}
          <text x={20} y={20} fill="#333" fontSize="16" fontWeight="bold">
            {mediciones?.[0]?.titulo || 'Mediciones del Sensor'}
          </text>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          
          <XAxis 
            dataKey="hora" 
            padding={{ left: 0, right: 0 }} // Centra más la línea
            tick={{ fontSize: 12 }}
          />
          
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          
          <Tooltip 
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          
          <Legend verticalAlign="top" />

          <Line
            type="monotone"
            dataKey="medicion"
            stroke="#5c9c48" // Color verde más clarito
            strokeWidth={3} // Línea más gruesa para que se vea "más completa"
            dot={{ r: 4, fill: "#5c9c48" }} // Añadir puntos para dar detalle
            activeDot={{ r: 6 }}
          />
          
          {/* Las líneas de referencia ayudan a dar contexto visual */}
          <ReferenceLine y={100} label="Max" stroke="red" strokeDasharray="3 3" />
          <ReferenceLine y={0} label="Min" stroke="blue" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}