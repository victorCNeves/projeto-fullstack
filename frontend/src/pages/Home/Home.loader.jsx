import { buscarGeneros } from '@/utils/tmdbUtils';

export const homeLoader = async () => {
  const generos = (await buscarGeneros()).genres;
  return { generos };
};
