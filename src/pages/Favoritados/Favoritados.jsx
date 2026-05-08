import { useLoaderData } from 'react-router';

const Favoritados = () => {
  const data = useLoaderData();

  return <>{data.nome}</>;
};

export default Favoritados;
