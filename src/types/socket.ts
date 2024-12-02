import { Socket } from 'socket.io-client';
import { IOrder } from './order';

export interface UseOrderUpdateOptions {
  socket: Socket;
}

export interface UseSendOrderOptions {
  socket: Socket;
  tableName: string;
  branchId: string;
  order: IOrder[];
}

export type UseSocketConnectionOptions = {
  // socket instance
  socket: Socket;
  onConnect?: () => void;
};

export interface UseJoinTableOptions {
  socket: Socket;
  tableName: string;
}

export interface UseJoinStaffRoomOptions {
  socket: Socket;
  branchId: string;
}
