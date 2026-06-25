import { Provider } from '@/components/ui/provider';
import { Theme } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes/index';
import { RouterProvider } from 'react-router';
import { WebSocketProvider } from './contexts/WebSocketContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WebSocketProvider>
      <Provider>
        <Theme appearance="dark" colorPalette="teal">
          <RouterProvider router={router} />
        </Theme>
      </Provider>
    </WebSocketProvider>
  </StrictMode>
);
