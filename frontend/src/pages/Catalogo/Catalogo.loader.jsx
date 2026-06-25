import { buscarFilmes, buscarGeneros } from '@/utils/tmdbUtils';

export const catalogoLoader = async () => {
  const filmes = await buscarFilmes();
  const generos = (await buscarGeneros()).genres;

  return { filmes, generos };
};
