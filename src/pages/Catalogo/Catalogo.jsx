import { useLoaderData } from 'react-router';
import CardFilme from '@/components/CardFilme';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import ContainerBusca from '@/components/ContainerBusca';
import { BuscaContext } from '@/contexts/BuscaContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { buscarFilmes } from '@/utils/tmdbUtils';

const Catalogo = () => {
  const { generos } = useLoaderData();
  const [filmes, setFilmes] = useState(useLoaderData().filmes);
  const { params, setParams } = useContext(BuscaContext);
  const update = useRef(false);

  useEffect(() => {
    if (update.current) {
      const carregarDados = async () => {
        const data = await buscarFilmes(params);

        setFilmes((filmes) => {
          const results =
            params.pagina === 1
              ? data.results
              : [...filmes.results, ...data.results];

          return {
            ...filmes,
            results: results,
            page: params.pagina,
          };
        });
      };
      carregarDados();
    } else {
      update.current = true;
    }
  }, [params]);
  return (
    <Box bg="black" minH="100vh" py={10}>
      <Container maxW="container.xl">
        <ContainerBusca generos={generos} />
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={6}>
          {filmes.results.map((filme) => (
            <CardFilme key={filme.id} filme={filme} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Catalogo;
