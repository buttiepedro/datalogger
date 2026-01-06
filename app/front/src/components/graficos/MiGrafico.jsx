import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label } from 'recharts';

const data = [
  { timestamp: '14:00', valor: 5 },
  { timestamp: '15:00', valor: 3 },
  { timestamp: '16:00', valor: 6 },
  { timestamp: '17:00', valor: 8 },
  { timestamp: '18:00', valor: 8 },
  { timestamp: '19:00', valor: 4 },
  { timestamp: '20:00', valor: 9 },
  { timestamp: '21:00', valor: 7 },
  { timestamp: '22:00', valor: 6 },
  { timestamp: '23:00', valor: 10 },
];

export default function GraficoPrueba({datos, max, min, titulo}) {
  return (
    // Usamos Tailwind para dar estilo al contenedor (fondo, bordes, sombra)
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 w-full h-80">
      <h2 className="text-lg font-bold mb-4 text-gray-700">{titulo}</h2>
       <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp"  />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#8884d8"
            dot={false}
          />
          <ReferenceLine y={10} label="Max" stroke="red" strokeDasharray="3 3" />
          <ReferenceLine y={2} label="Min" stroke="green" strokeDasharray="3 3"/>
          <Legend />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}