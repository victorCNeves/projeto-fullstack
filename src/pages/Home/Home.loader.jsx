import { obterGenerosComCache } from '@/utils/tmdbUtils';

export const homeLoader = async () => {
  const generos = (await obterGenerosComCache).genres;
  console.log(generos);
  return { generos };
};
