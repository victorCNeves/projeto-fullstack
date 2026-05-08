import { useLoaderData } from 'react-router';

const DetalhesFilme = () => {
  const data = useLoaderData();

  return <>{data.nome}</>;
};

export default DetalhesFilme;
