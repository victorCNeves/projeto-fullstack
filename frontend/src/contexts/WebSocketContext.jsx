import { getToken } from '@/utils/authUtils';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `${import.meta.env.VITE_NOTIFICATION_SERVICE}?token=${getToken()}`
    );

    ws.current.onopen = () => setIsConnected(true);

    ws.current.onmessage = (eventMsg) => {
      try {
        const { event, data } = JSON.parse(eventMsg.data);

        setLastMessage({ event, data, timestamp: Date.now() });
      } catch (error) {
        console.error('Erro no WebSocket', error);
      }
    };

    ws.current.onclose = () => setIsConnected(false);

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ lastMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

//TODO: adicionar nome dos generos nos filmes para ficar bom nos cards
