import { getToken } from './authUtils';
import { redirect } from 'react-router';

const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${import.meta.env.VITE_API_BASE_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error(`Falha na API (${endpoint}):`, error);
    throw error;
  }
};

const requisicaoTMDB = async (caminho, parametros = {}) => {
  const params = new URLSearchParams(parametros).toString();
  const endpoint = params ? `${caminho}?${params}` : caminho;
  return fetchApi(endpoint, { method: 'GET' });
};

const popularGenerosNosFilmes = (filmes, generos) => {
  return filmes.map((filme) => ({
    ...filme,
    genre_ids: filme.genre_ids.map(
      (id) => generos.find((g) => g.id === id) || id
    ),
  }));
};

const popularFilmesNosGeneros = async (listaGeneros) => {
  return Promise.all(
    listaGeneros.map(async (genero) => {
      const data = await requisicaoTMDB('discover/movie', {
        sort_by: 'popularity.desc',
        with_genres: genero.id,
        page: '1',
      });

      data.results = popularGenerosNosFilmes(data.results, listaGeneros);

      return { ...genero, movies: data };
    })
  );
};

let generosEmMemoria = null;
const obterApenasGeneros = async () => {
  if (generosEmMemoria) return generosEmMemoria;
  const data = await requisicaoTMDB('genre/movie/list');
  generosEmMemoria = data.genres;
  return generosEmMemoria;
};

export const buscarGeneros = async () => {
  try {
    const data = await requisicaoTMDB('genre/movie/list');
    data.genres = await popularFilmesNosGeneros(data.genres);
    return data;
  } catch (error) {
    console.error('Erro ao buscar gêneros', error);
    throw error;
  }
};

const buscarFilmesApi = async () => {
  try {
    const data = await requisicaoTMDB('discover/movie', {
      sort_by: 'popularity.desc',
      page: '1',
    });

    const generos = await obterApenasGeneros();

    data.results = popularGenerosNosFilmes(data.results, generos);

    return data;
  } catch (error) {
    console.error('Erro ao buscar filmes API', error);
    throw error;
  }
};

export const buscarFilmes = async ({
  pagina = 1,
  busca = '',
  generoId = '',
  dataInicio = '',
  dataFim = '',
} = {}) => {
  try {
    const semFiltros =
      !busca && !generoId && !dataInicio && !dataFim && pagina === 1;

    if (semFiltros) {
      return await buscarFilmesApi();
    }

    const parametros = { page: pagina.toString() };
    const endpoint = busca ? 'search/movie' : 'discover/movie';

    if (busca) {
      parametros.query = busca;
    } else {
      if (generoId) parametros.with_genres = generoId;
      if (dataInicio) parametros['primary_release_date_gte'] = dataInicio;
      if (dataFim) parametros['primary_release_date_lte'] = dataFim;
    }

    const filmes = await requisicaoTMDB(endpoint, parametros);
    const generos = await obterApenasGeneros();

    filmes.results = popularGenerosNosFilmes(filmes.results, generos);

    return filmes;
  } catch (error) {
    console.error('Erro na busca de filmes', error);
    throw error;
  }
};

export const buscarFilme = async (id) => {
  try {
    const filme = await requisicaoTMDB(`movies/${id}`);

    const listaGeneros = await obterApenasGeneros();

    filme.genres = (filme.genre_ids || []).map(
      (id) =>
        listaGeneros.find((g) => g.id === id) || { id, name: 'Desconhecido' }
    );

    return filme;
  } catch (error) {
    console.error(`Erro ao buscar e popular o filme ${id}:`, error);
    throw error;
  }
};

export const salvarFilmeAction = async ({ request, params }) => {
  console.log('me chamaram');
  const formData = await request.formData();
  const method = request.method;

  const genre_ids = formData.getAll('genre_ids').map(Number);

  const getNumberOrUndefined = (val) => (val ? Number(val) : undefined);

  const payload = {
    title: formData.get('title'),
    original_title: formData.get('original_title') || undefined,
    overview: formData.get('overview') || undefined,
    original_language: formData.get('original_language') || undefined,
    release_date: formData.get('release_date') || undefined,
    popularity: getNumberOrUndefined(formData.get('popularity')),
    vote_average: getNumberOrUndefined(formData.get('vote_average')),
    vote_count: getNumberOrUndefined(formData.get('vote_count')),
    poster_path: formData.get('poster_path') || undefined,
    backdrop_path: formData.get('backdrop_path') || undefined,
    genre_ids: genre_ids.length > 0 ? genre_ids : undefined,
  };

  try {
    if (method === 'POST') {
      const response = await fetchApi('movies', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const novoId = response?._id || response?.id;

      return redirect(novoId ? `/detalhes/${novoId}` : '/catalogo');
    }

    if (method === 'PUT') {
      await fetchApi(`movies/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      return redirect(`/detalhes/${params.id}`);
    }
  } catch (error) {
    console.error(`Erro ao processar o formulário (${method}):`, error);
    return { error: 'Falha ao salvar o filme. Verifique os campos.' };
  }
};

export const deletarFilmeAction = async ({ params }) => {
  try {
    await fetchApi(`movies/${params.id}`, {
      method: 'DELETE',
    });

    return redirect('/catalogo');
  } catch (error) {
    console.error('Erro ao deletar o filme:', error);
    throw new Error('Não foi possível excluir o filme.');
  }
};
