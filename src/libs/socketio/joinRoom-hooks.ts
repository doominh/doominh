import { useCallback } from 'react';
import { UseJoinStaffRoomOptions, UseJoinTableOptions } from '~/types/socket';

// 🙎 Customer join a table room
export function useJoinTable({
  socket,
  tableName
}: UseJoinTableOptions): () => void {
  // Use useCallback to ensure the joinTable function is not recreated every time the component renders
  const joinTable = useCallback(() => {
    socket.emit('joinTable', { tableName });
  }, [socket, tableName]);

  return joinTable;
}

/** --------------------------------- 
🌟☄️🌟☄️🌟☄️🌟☄️🌟☄️🌟☄️🌟☄️🌟☄️🌟☄️
-------------------------------------*/

// 💁‍♀️ Staff join a staff room
export function useJoinBranchRoom({
  socket,
  branchId
}: UseJoinStaffRoomOptions): () => void {
  // Use useCallback to ensure the joinStaffRoom function is not recreated every time the component renders
  const joinStaffRoom = useCallback(() => {
    socket.emit('joinBranchRoom', { branchId });
  }, [socket, branchId]);

  return joinStaffRoom;
}
