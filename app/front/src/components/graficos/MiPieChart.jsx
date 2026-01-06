import { Cell, Pie, PieChart, Legend } from 'recharts';

const data = [
  { name: 'Grupo A', value: 4 },
  { name: 'Grupo B', value: 2 },
  { name: 'Grupo C', value: 3 },
  { name: 'Grupo D', value: 1 },
];

const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  } = props;

  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);

  return (
    <>
    <text
      x={x}
      y={y}
      fill="white"
      fontSize="20"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      >
      {`${value}`}
    </text>
    </>
  );
};

export default function MiPieChart({ isAnimationActive = true, datos }) {
  const dato = [];
  for (let i = 0; i < datos?.length; i++) {
    if (dato.some(e => e.name === datos[i].tipo_sensor.id_unidad)) {
      const index = dato.findIndex(e => e.name === datos[i].tipo_sensor.id_unidad);
      dato[index].value += 1;
      continue;
    }
    dato.push({ name: datos[i].tipo_sensor.id_unidad, value: 1});
  }
  
  
  return (
    <PieChart
      style={{
        width: '100%',
        maxWidth: '300px',
        maxHeight: '80vh',
        aspectRatio: 1,
      }}
    >
      <Pie
        data={dato}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        
        isAnimationActive={isAnimationActive}
      >
        {dato.map((entry, index) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Legend
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
        iconType="circle"
      />
    </PieChart>
  );
}
