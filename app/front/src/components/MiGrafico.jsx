import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', ventas: 5 },
  { name: 'Feb', ventas: 3 },
  { name: 'Mar', ventas: 6 },
  { name: 'Abr', ventas: 8 },
  { name: 'Abr', ventas: 8 },
  { name: 'May', ventas: 4 },
  { name: 'Jun', ventas: 9 },
  { name: 'Jul', ventas: 7 },
  { name: 'Ago', ventas: 6 },
  { name: 'Sep', ventas: 10 },
];

export default function GraficoPrueba() {
  return (
    // Usamos Tailwind para dar estilo al contenedor (fondo, bordes, sombra)
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 w-full h-80">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Reporte de Ventas 2025</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{fill: '#9ca3af'}} />
          <YAxis tick={{fill: '#9ca3af'}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}