import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import colorsCharts from '~/constants';

interface Props {
  chartData: { name: string; total: number }[];
}

interface State {
  chartData: { name: string; total: number }[];
}

export default class BarChartsRevenue extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      chartData: this.generateChartData()
    };
  }

  generateChartData(): { name: string; total: number }[] {
    return this.props.chartData.map(data => ({
      name: data.name,
      total: data.total
    }));
  }

  getColorForBar(total: number): string {
    if (total < 60) {
      return colorsCharts.pink;
    } else {
      return colorsCharts.cyan;
    }
  }

  render() {
    return (
      <div className="">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={this.state.chartData}>
            <XAxis dataKey="name" stroke="#000000" />
            <YAxis stroke="#000000" />
            <Tooltip
              wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
              formatter={function (total) {
                return `${total}`;
              }}
            />
            <Bar dataKey="total">
              {this.state.chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={this.getColorForBar(entry.total)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
