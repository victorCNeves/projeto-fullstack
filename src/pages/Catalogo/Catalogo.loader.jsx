import { buscarFilmes, obterGenerosComCache } from '@/utils/tmdbUtils';

export const catalogoLoader = async () => {
  const filmes = await buscarFilmes();
  const generos = (await obterGenerosComCache()).genders;

  return { filmes, generos };
};
