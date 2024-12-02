import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import colorsCharts from '~/constants';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group D', value: 200 },
  { name: 'Group D', value: 200 },
  { name: 'Group D', value: 200 }
];

interface ColorsCharts {
  [key: string]: string;
}

const AreCharts = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-base-100 p-2 shadow-md lg:w-full ">
      <div className="p-2">
        <p className="text-[1.1rem] font-semibold text-primary">
          {t('adminPage.dashboard.chartsDashboard.areChart.chartTitle')}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={500} height={300}>
          <Pie
            data={data}
            cx={'50%'}
            cy={130}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {Object.keys(colorsCharts).map((key, index) => (
              <Cell
                key={`cell-${index}`}
                fill={(colorsCharts as ColorsCharts)[key]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreCharts;
