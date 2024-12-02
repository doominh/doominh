import { useEffect, useState } from 'react';
import { UseOrderUpdateOptions } from '~/types/socket';
import { IDeleteData } from '~/types/bill-details';

export function useGetDeleteBill({ socket }: UseOrderUpdateOptions) {
  const [data, setData] = useState<IDeleteData>();

  useEffect(() => {
    const handleDeleteBill = (deletedData: IDeleteData) => {
      console.log('Received billDetailDeleted:', deletedData);
      setData(deletedData);
    };
    socket.on('billDetailDeleted', handleDeleteBill);
    return () => {
      socket.off('billDetailDeleted', handleDeleteBill);
    };
  }, [socket]);

  return data;
}
