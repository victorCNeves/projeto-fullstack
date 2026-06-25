import { useLoaderData } from 'react-router';
import CardFilme from '@/components/CardFilme';
import {
  Box,
  Container,
  SimpleGrid,
  Skeleton,
  Flex,
  Heading,
} from '@chakra-ui/react';
import ContainerBusca from '@/components/ContainerBusca';
import { BuscaContext } from '@/contexts/BuscaContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { buscarFilmes } from '@/utils/tmdbUtils';
import { useWebSocket } from '@/contexts/WebSocketContext';

const Catalogo = () => {
  const { generos } = useLoaderData();
  const [filmes, setFilmes] = useState(useLoaderData().filmes);
  const [carregando, setCarregando] = useState(false);
  const { params, setParams } = useContext(BuscaContext);
  const update = useRef(false);
  const ref = useRef(null);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (!lastMessage) return;

    const { event, data } = lastMessage;
    const incomingId = data._id || data.id;

    switch (event) {
      case 'resource.created':
        setFilmes((prev) => ({
          ...prev,
          results: [data, ...prev.results],
        }));
        break;

      case 'resource.updated':
        setFilmes((prev) => ({
          ...prev,
          results: prev.results.map((f) =>
            f.id === incomingId || f._id === incomingId ? { ...f, ...data } : f
          ),
        }));
        break;

      case 'resource.deleted':
        setFilmes((prev) => ({
          ...prev,
          results: prev.results.filter(
            (f) => f.id !== incomingId && f._id !== incomingId
          ),
        }));
        break;

      default:
        break;
    }
  }, [lastMessage]);

  useEffect(() => {
    if (update.current) {
      const carregarDados = async () => {
        setCarregando(true);
        const data = await buscarFilmes(params);

        setFilmes((filmes) => ({
          ...filmes,
          results:
            params.pagina === 1
              ? data.results
              : [
                  ...filmes.results,
                  ...data.results.filter(
                    (novo) =>
                      !filmes.results.some(
                        (existente) => existente.id === novo.id
                      )
                  ),
                ],
          page: params.pagina,
        }));
        setCarregando(false);
      };
      carregarDados();
    } else {
      update.current = true;
    }
  }, [params]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !carregando &&
          filmes.page < filmes.total_pages &&
          filmes.results.length > 0
        ) {
          setParams((param) => ({ ...param, pagina: param.pagina + 1 }));
          setCarregando(true);
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [carregando, filmes.page, filmes.total_pages]);

  return (
    <Box bg="black" minH="100vh" py={10}>
      <Container maxW="container.xl">
        <ContainerBusca generos={generos} />
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={6}>
          {filmes.results.map((filme) => (
            <CardFilme key={filme.id} filme={filme} />
          ))}
          {carregando &&
            Array(5)
              .fill(null)
              .map((_, i) => (
                <Skeleton
                  key={`skeleton-${i}`}
                  minH="600px"
                  borderRadius="md"
                />
              ))}
        </SimpleGrid>
        {!carregando && filmes.results.length === 0 && (
          <Flex
            minW="full"
            minH="full"
            justifyContent="center"
            alignItems="center"
          >
            <Heading>Nenhum filme encontrado para essa busca.</Heading>
          </Flex>
        )}
      </Container>
      <div ref={ref} />
    </Box>
  );
};

export default Catalogo;
