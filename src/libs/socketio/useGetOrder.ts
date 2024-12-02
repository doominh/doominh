import { useEffect, useState } from 'react';
import { EmployeeOrdersData, IOrder } from '~/types/order';
import { UseOrderUpdateOptions } from '~/types/socket';

export function useOrderUpdate({ socket }: UseOrderUpdateOptions) {
  const [data, setData] = useState<IOrder[] | EmployeeOrdersData>([]);

  useEffect(() => {
    const handleOrderUpdate = (data: IOrder[] | EmployeeOrdersData) => {
      setData(data);
    };

    // Listen for the 'orderUpdate' event
    socket.on('orderUpdate', handleOrderUpdate);

    // clean up function
    return () => {
      socket.off('orderUpdate', handleOrderUpdate);
    };
  }, [socket]);

  return data;
}
