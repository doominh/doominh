import { PureComponent } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { withTranslation, WithTranslation } from 'react-i18next';

import colorsCharts from '~/constants';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

interface Props extends WithTranslation {}

class SimpleAreaCharts extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <div className="w-full overflow-x-auto rounded-lg bg-base-100 p-2 shadow-md md:w-full lg:w-full">
        <div className="p-2">
          <p className="mb-[10px] text-[1.1rem] font-semibold text-primary">
            {t(
              'adminPage.branchesManagerment.branchDetails.chartsBranchDetails.chartTitle'
            )}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={290}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill={colorsCharts.orange}
              stackId={1}
            />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill={colorsCharts.cyan}
              stackId={1}
            />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill={colorsCharts.pink}
              stackId={1}
            />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withTranslation()(SimpleAreaCharts);
