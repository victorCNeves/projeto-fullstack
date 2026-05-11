const DIA_EM_MILISSEGUNDOS = 1000 * 60 * 60 * 24;
const HORA_EM_MILISSEGUNDOS = 1000 * 60 * 60;
const MARGEM_REVALIDACAO = 1000 * 60 * 10;

const requisicaoTMDB = async (caminho, parametros = {}) => {
  const params = new URLSearchParams({
    language: 'pt-BR',
    include_adult: 'false',
    include_video: 'false',
    ...parametros,
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${caminho}?${params}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    }
  );

  return response.json();
};

const buscarESalvarGeneros = async () => {
  const data = await requisicaoTMDB('genre/movie/list');

  data.genres = await popularFilmesNosGeneros(data.genres);
  data.timestamp = Date.now();

  localStorage.setItem('generos', JSON.stringify(data));
  return data;
};

const buscarESalvarFilmes = async () => {
  const data = await requisicaoTMDB('discover/movie', {
    sort_by: 'popularity.desc',
    page: '1',
  });
  const generos = await obterGenerosComCache;
  popularGenerosNosFilmes(data.results, generos.genres);
  popularFavoritosNosFilmes(data.results);

  data.timestamp = Date.now();
  localStorage.setItem('filmes_catalogo', JSON.stringify(data));
  return data;
};

const processarCache = async (chave, tempoExpiracao, buscaAssincrona) => {
  const cache = JSON.parse(localStorage.getItem(chave));
  const agora = Date.now();
  const tempoPassado = cache ? agora - cache.timestamp : Infinity;

  if (tempoPassado < tempoExpiracao) {
    if (tempoPassado > tempoExpiracao - MARGEM_REVALIDACAO) {
      buscaAssincrona();
    }
    return cache;
  }

  return await buscaAssincrona();
};

const popularGenerosNosFilmes = (filmes, generos) => {
  filmes.forEach((filme) => {
    filme.genre_ids = filme.genre_ids.map(
      (id) => generos.find((g) => g.id === id) || id
    );
  });
};

const popularFavoritosNosFilmes = (filmes) => {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

  filmes.forEach((filme) => {
    filme.is_favorite = !!favoritos.find((f) => f.id === filme.id);
  });
};

const popularFilmesNosGeneros = async (listaGeneros) => {
  return Promise.all(
    listaGeneros.map(async (genero) => {
      const data = await requisicaoTMDB('discover/movie', {
        sort_by: 'popularity.desc',
        with_genres: genero.id,
        page: '1',
      });

      popularGenerosNosFilmes(data.results, listaGeneros);
      popularFavoritosNosFilmes(data.results);

      return { ...genero, movies: data };
    })
  );
};

const obterFilmesCatalogoComCache = processarCache(
  'filmes_catalogo',
  HORA_EM_MILISSEGUNDOS,
  buscarESalvarFilmes
);

export const obterGenerosComCache = processarCache(
  'generos',
  DIA_EM_MILISSEGUNDOS,
  buscarESalvarGeneros
);

export const buscarFilmes = async ({
  pagina = 1,
  busca = '',
  generoId = '',
  dataInicio = '',
  dataFim = '',
} = {}) => {
  const semFiltros =
    !busca && !generoId && !dataInicio && !dataFim && pagina === 1;

  if (semFiltros) {
    return await obterFilmesCatalogoComCache;
  }

  const parametros = {
    page: pagina.toString(),
  };

  const endpoint = busca ? 'search/movie' : 'discover/movie';

  if (busca) {
    parametros.query = busca;
    if (dataInicio)
      parametros.primary_release_year = dataInicio.substring(0, 4);
  } else {
    if (generoId) parametros.with_genres = generoId;
    if (dataInicio) parametros['primary_release_date.gte'] = dataInicio;
    if (dataFim) parametros['primary_release_date.lte'] = dataFim;
  }
  const filmes = await requisicaoTMDB(endpoint, parametros);
  popularFavoritosNosFilmes(filmes.results);
  popularGenerosNosFilmes(filmes.results, (await obterGenerosComCache).genres);
  return filmes;
};

export const toggleFavorite = (filme) => {
  let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

  const isFavorite = favoritos.find((f) => f.id === filme.id);

  if (isFavorite) {
    favoritos = favoritos.filter((f) => f.id !== filme.id);
  } else {
    favoritos.push(filme);
  }

  filme.is_favorite = !isFavorite;

  const filmes = JSON.parse(
    localStorage.getItem('filmes_catalogo') || "{'results':[]}"
  );
  const filme_catalogo = filmes.results.find((f) => f.id === filme.id);
  filme_catalogo ? (filme_catalogo.is_favorite = !isFavorite) : null;

  localStorage.setItem('filmes_catalogo', JSON.stringify(filmes));

  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  return !isFavorite;
};
