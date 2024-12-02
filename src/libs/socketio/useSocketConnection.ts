import { useEffect } from 'react';
import { UseSocketConnectionOptions } from '~/types/socket';

export function useSocketConnection({
  socket,
  onConnect
}: UseSocketConnectionOptions) {
  useEffect(() => {
    // connect to the server if the socket is not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Handle the connect event
    const handleConnect = () => {
      if (onConnect) {
        onConnect();
      }
    };

    // Listen to the connect event
    socket.on('connect', handleConnect);

    // Return a function to remove the event listener and disconnect the socket
    return () => {
      socket.off('connect', handleConnect);
      socket.disconnect();
    };
  }, [socket, onConnect]);
}
