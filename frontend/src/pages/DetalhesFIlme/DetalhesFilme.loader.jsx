import { validate } from '@/utils/authUtils';
import { buscarFilme, buscarGeneros } from '@/utils/tmdbUtils';

export const detalhesLoader = async ({ params }) => {
  const filme = await buscarFilme(params.id);
  const userId = await validate();
  const genres = (await buscarGeneros()).genres;
  return { filme, userId, genres };
};
