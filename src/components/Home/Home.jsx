import { useLoaderData } from 'react-router';

const Home = () => {
  const data = useLoaderData();

  return <>{data.nome}</>;
};

export default Home;
