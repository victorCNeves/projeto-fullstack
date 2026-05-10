import { BuscaProvider } from '@/contexts/BuscaContext';
import Header from './Header';
import { Outlet } from 'react-router';

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
