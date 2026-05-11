import { createBrowserRouter } from 'react-router';
import App from '@/App';
import Home from '@/pages/Home/Home';
import { homeLoader } from '@/pages/Home/Home.loader';
import Catalogo from '@/pages/Catalogo/Catalogo';
import { catalogoLoader } from '@/pages/Catalogo/Catalogo.loader';
import Favoritados from '@/pages/Favoritados/Favoritados';
import DetalhesFilme from '@/pages/DetalhesFIlme/DetalhesFilme';
import { detalhesLoader } from '@/pages/DetalhesFIlme/DetalhesFilme.loader';

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
      },
      {
        path: 'detalhes/:id',
        Component: DetalhesFilme,
        loader: detalhesLoader,
      },
    ],
  },
]);
