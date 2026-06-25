import { BuscaProvider } from '@/contexts/BuscaContext';
import Header from '@/components/Header';
import { Outlet } from 'react-router';
import { WebSocketProvider } from './contexts/WebSocketContext';

function App() {
  return (
    <>
      <Header />
      <main>
        <BuscaProvider>
          <Outlet />
        </BuscaProvider>
      </main>
    </>
  );
}

export default App;
