import { useCallback } from 'react';
import { UseSendOrderOptions } from '~/types/socket';

export function useSendOrder({
  socket,
  tableName,
  branchId,
  order
}: UseSendOrderOptions) {
  // Use useCallback to ensure the sendOrder function is not recreated every time the component renders
  const sendOrder = useCallback(() => {
    socket.emit('order', {
      tableName,
      branchId,
      order
    });
  }, [socket, tableName, branchId]);

  return sendOrder;
}
