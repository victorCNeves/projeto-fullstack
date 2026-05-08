const DIA_EM_MILISSEGUNDOS = 1000 * 60 * 60 * 24;
const HORA_EM_MILISSEGUNDOS = 1000 * 60 * 60;

export const catalogoLoader = async () => {
  //TODO: talvez colocar essa lógica aqui em outro lugar
  const filmesCatalogoSalvos = JSON.parse(
    localStorage.getItem('filmes_catalogo')
  );
  const cacheFilmes =
    filmesCatalogoSalvos &&
    Date.now() - filmesCatalogoSalvos.timestamp < HORA_EM_MILISSEGUNDOS;

  let filmes;

  if (cacheFilmes) {
    filmes = filmesCatalogoSalvos;
  } else {
    const res = await fetch('../filmes.json');
    filmes = await res.json();

    filmes.timestamp = Date.now();
    localStorage.setItem('filmes_catalogo', JSON.stringify(filmes));
  }

  filmes = filmes.results;

  const generosSalvos = JSON.parse(localStorage.getItem('generos'));
  const cacheGeneros =
    generosSalvos &&
    Date.now() - generosSalvos.timestamp < DIA_EM_MILISSEGUNDOS;

  let generos;

  if (cacheGeneros) {
    generos = generosSalvos;
  } else {
    const res = await fetch('../generos.json');
    generos = await res.json();
    generos.genres = await Promise.all(
      generos.genres.map(async (genero) => {
        const resp = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}discover/movie?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc&with_genres=${genero.id}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        genero.movies = await resp.json();

        return { ...genero };
      })
    );

    generos.timestamp = Date.now();
    localStorage.setItem('generos', JSON.stringify(generos));
  }

  generos = generos.genres;

  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

  filmes.forEach((filme) => {
    filme.genre_ids = filme.genre_ids.map(
      (id) => (id = generos.find((e) => e.id === id))
    );
    let is_favorite = false;
    if (favoritos.find((e) => e.id === filme.id)) {
      is_favorite = true;
    }

    filme.is_favorite = is_favorite;
  });

  return { filmes, generos };
};
