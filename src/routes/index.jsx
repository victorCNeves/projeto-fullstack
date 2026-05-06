import { createBrowserRouter } from 'react-router';
import App from '@/components/App';
import Home from '@/components/Home/Home';
import { homeLoader } from '@/components/Home/Home.loader';
import Catalogo from '@/components/Catalogo/Catalogo';
import { catalogoLoader } from '@/components/Catalogo/Catalogo.loader';
import Favoritados from '@/components/Favoritados/Favoritados';
import { favoritadosLoader } from '@/components/Favoritados/Favoritados.loader';
import DetalhesFilme from '@/components/DetalhesFilme/DetalhesFilme';
import { detalhesLoader } from '@/components/DetalhesFilme/DetalhesFilme.loader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },
      {
        path: 'catalogo',
        Component: Catalogo,
        loader: catalogoLoader,
      },
      {
        path: 'favoritados',
        Component: Favoritados,
        loader: favoritadosLoader,
      },
      {
        path: 'detalhes/:id',
        Component: DetalhesFilme,
        loader: detalhesLoader,
      },
    ],
  },
]);
