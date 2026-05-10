import { useLoaderData } from 'react-router';
import { Box, VStack } from '@chakra-ui/react';
import Carrosel from '@/components/Carrossel';

const Home = () => {
  const { generos } = useLoaderData();
  return (
    <Box minH="100vh" w="full">
      <VStack align="stretch">
        {generos.map((genero, key) => (
          <Carrosel
            generoId={genero.id}
            titulo={genero.name}
            filmes={genero.movies}
            key={key}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Home;
