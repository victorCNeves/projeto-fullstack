import { Provider } from '@/components/ui/provider';
import { Theme } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes/index';
import { RouterProvider } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <Theme appearance="dark" colorPalette="teal">
        <RouterProvider router={router} />
      </Theme>
    </Provider>
  </StrictMode>
);
