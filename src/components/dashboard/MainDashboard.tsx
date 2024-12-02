import React from 'react';
import StatsDashboard from '../charts/StatsDashboard';
import ChartDashBoard from '../charts/ChartDashboard';
import TableBill from '../table/TableBill';
import ModalNotify from './ModalNotify';

const MainDashboard: React.FC<{}> = () => {
  return (
    <div className="mt-[40px] md:mt-[0]">
      <ModalNotify />
      <StatsDashboard />
      <TableBill />
      <ChartDashBoard />
    </div>
  );
};

export default MainDashboard;
