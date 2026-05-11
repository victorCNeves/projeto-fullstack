import CardFilme from '@/components/CardFilme';
import { FavoritadosContext } from '@/contexts/FavoritadosContext';
import { Box, Container, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useContext } from 'react';

const Favoritados = () => {
  const { favoritados } = useContext(FavoritadosContext);
  return (
    <Box bg="black" minH="100vh" py={10}>
      {favoritados && favoritados.length > 0 ? (
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={6}>
            {favoritados.map((filme) => (
              <CardFilme key={filme.id} filme={filme} />
            ))}
          </SimpleGrid>
        </Container>
      ) : (
        <Flex
          minW="100%"
          minH="80vh"
          justifyContent="center"
          alignItems="center"
        >
          <Heading>Você não possui filmes favoritados.</Heading>
        </Flex>
      )}
    </Box>
  );
};

export default Favoritados;
