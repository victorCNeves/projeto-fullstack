import { useLoaderData } from 'react-router';
import { Box, VStack } from '@chakra-ui/react';
import Carrosel from '@/components/Carrossel';

const Home = () => {
  const { generos } = useLoaderData();
  console.log(generos);
  return (
    <Box minH="100vh" w="full">
      <VStack align="stretch">
        {generos.map((genero, key) => (
          <Carrosel
            titulo={genero.name}
            filmes={genero.movies.results}
            key={key}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Home;
