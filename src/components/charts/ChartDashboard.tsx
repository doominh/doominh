import React from 'react';
import AreCharts from './AreaCharts';
import PieChartLevel from './PieChartLevel';
import ComposedCharts from './ComposedCharts';

const ChartDashBoard: React.FC<{}> = () => {
  return (
    <div className="mt-[0] w-full justify-between overflow-x-hidden xl:mt-[40px]">
      <div className="grid grid-cols-1  gap-[10px] md:grid-cols-2">
        <AreCharts />
        <PieChartLevel />
      </div>
      <div className="mt-[10px]">
        <ComposedCharts />
      </div>
    </div>
  );
};

export default ChartDashBoard;
