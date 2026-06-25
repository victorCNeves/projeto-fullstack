import { createBrowserRouter, redirect } from 'react-router';
import App from '@/App';
import Home from '@/pages/Home/Home';
import { homeLoader } from '@/pages/Home/Home.loader';
import Catalogo from '@/pages/Catalogo/Catalogo';
import { catalogoLoader } from '@/pages/Catalogo/Catalogo.loader';
import DetalhesFilme from '@/pages/DetalhesFIlme/DetalhesFilme';
import { detalhesLoader } from '@/pages/DetalhesFIlme/DetalhesFilme.loader';
import ErrorPage from '@/pages/ErrorPage';
import Login from '@/pages/Login';
import FormularioFilme from '@/pages/FormularioFilme/FormularioFilme';
import { validate } from '@/utils/authUtils';
import {
  buscarGeneros,
  deletarFilmeAction,
  salvarFilmeAction,
} from '@/utils/tmdbUtils';

const authLoader = async () => {
  const isAuthenticated = await validate();
  if (!isAuthenticated) {
    return redirect('/login');
  }
  return null;
};

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          loader: authLoader,
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
              path: 'detalhes/:id',
              Component: DetalhesFilme,
              loader: detalhesLoader,
            },
            {
              path: 'detalhes/:id/editar',
              Component: FormularioFilme,
              loader: detalhesLoader,
              action: salvarFilmeAction,
            },
            {
              path: 'detalhes/:id/deletar',
              action: deletarFilmeAction,
            },
            {
              path: 'adicionar',
              Component: FormularioFilme,
              loader: async () => ({ genres: (await buscarGeneros()).genres }),
              action: salvarFilmeAction,
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      Component: Login,
    },
  ],
  {
    basename: '/',
  }
);
