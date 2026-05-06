import { useLoaderData } from 'react-router';

const Catalogo = () => {
  const data = useLoaderData();

  return <>{data.nome}</>;
};

export default Catalogo;
