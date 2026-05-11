import { BuscaProvider } from '@/contexts/BuscaContext';
import Header from '@/components/Header';
import { Outlet } from 'react-router';
import { FavoritadosProvider } from './contexts/FavoritadosContext';

function App() {
  return (
    <>
      <Header />
      <main>
        <FavoritadosProvider>
          <BuscaProvider>
            <Outlet />
          </BuscaProvider>
        </FavoritadosProvider>
      </main>
    </>
  );
}

export default App;
