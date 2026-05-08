import { useLoaderData } from 'react-router';
import CardFilme from '@/components/CardFilme';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import ContainerBusca from '@/components/ContainerBusca';

const Catalogo = () => {
  const { filmes, generos } = useLoaderData();

  return (
    <Box bg="black" minH="100vh" py={10}>
      <Container maxW="container.xl">
        <ContainerBusca generos={generos} />
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={6}>
          {filmes.map((filme) => (
            <CardFilme key={filme.id} filme={filme} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Catalogo;
