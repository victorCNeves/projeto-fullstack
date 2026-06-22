import { buscarFilme } from '@/utils/tmdbUtils';

export const detalhesLoader = async ({ params }) => {
  const filme = await buscarFilme(params.id);
  return { filme };
};
