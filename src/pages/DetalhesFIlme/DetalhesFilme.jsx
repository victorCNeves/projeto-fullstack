import {
  Box,
  Badge,
  Button,
  Container,
  Flex,
  Icon,
  Image,
  Text,
} from '@chakra-ui/react';
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaCalendar,
  FaGlobe,
} from 'react-icons/fa';
import { Link, useLoaderData } from 'react-router';
import { useContext, useEffect } from 'react';
import { FavoritadosContext } from '@/contexts/FavoritadosContext';

const DetalhesFilme = () => {
  const { filme } = useLoaderData();
  const { handleFavorite, favoritados } = useContext(FavoritadosContext);
  const isFavorite = favoritados.some((f) => f.id === filme.id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filme]);

  const backdropUrl = filme.backdrop_path
    ? `https://image.tmdb.org/t/p/original${filme.backdrop_path}`
    : null;

  const posterUrl = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : 'https://placehold.co/500x700?text=No+Image';

  const renderStars = (nota) => {
    const stars = [];
    const fullStars = Math.floor(nota / 2);
    const hasHalfStar = nota % 2 >= 1;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Icon key={i} as={FaStar} color="yellow.400" boxSize={5} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Icon key={i} as={FaStarHalfAlt} color="yellow.400" boxSize={5} />
        );
      } else {
        stars.push(
          <Icon key={i} as={FaRegStar} color="gray.600" boxSize={5} />
        );
      }
    }
    return stars;
  };

  const formatCurrency = (value) =>
    value > 0
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
        }).format(value)
      : '—';

  const runtime = filme.runtime
    ? `${Math.floor(filme.runtime / 60)}h ${filme.runtime % 60}min`
    : '—';

  return (
    <Box bg="gray.950" minH="100vh">
      <Box
        position="relative"
        h={{ base: '300px', md: '500px' }}
        overflow="hidden"
      >
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={filme.title}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        ) : (
          <Box w="100%" h="100%" bg="gray.900" />
        )}
        <Box
          position="absolute"
          inset={0}
          bgGradient="to-b"
          gradientFrom="transparent"
          gradientTo="gray.950"
        />
      </Box>

      <Container maxW="container.xl" pb={16}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={8}
          mt={{ base: '-80px', md: '-140px' }}
          position="relative"
          zIndex={1}
        >
          <Box
            flexShrink={0}
            w={{ base: '160px', md: '260px' }}
            mx={{ base: 'auto', md: 0 }}
          >
            <Image
              src={posterUrl}
              alt={filme.title}
              borderRadius="xl"
              boxShadow="0 25px 60px rgba(0,0,0,0.8)"
              w="100%"
            />
          </Box>

          <Box flex={1} pt={{ base: 4, md: '120px' }}>
            {filme.tagline && (
              <Text color="teal.400" fontStyle="italic" fontSize="sm" mb={1}>
                "{filme.tagline}"
              </Text>
            )}

            <Text
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              color="white"
              lineHeight="shorter"
              mb={1}
            >
              {filme.title}
            </Text>

            {filme.original_title !== filme.title && (
              <Text color="gray.500" fontSize="sm" mb={3}>
                {filme.original_title}
              </Text>
            )}

            <Flex gap={2} flexWrap="wrap" mb={4}>
              {filme.genres?.map((g) => (
                <Badge
                  key={g.id}
                  colorPalette="teal"
                  variant="outline"
                  size="md"
                >
                  {g.name}
                </Badge>
              ))}
            </Flex>

            <Flex align="center" gap={3} mb={4}>
              <Flex align="center" gap={1}>
                {renderStars(filme.vote_average)}
              </Flex>
              <Text color="white" fontWeight="bold">
                {filme.vote_average.toFixed(1)}
              </Text>
              <Text color="gray.500" fontSize="sm">
                ({filme.vote_count.toLocaleString('pt-BR')} votos)
              </Text>
            </Flex>

            <Flex gap={6} mb={6} flexWrap="wrap">
              <Flex align="center" gap={2} color="gray.400" fontSize="sm">
                <Icon as={FaCalendar} />
                <Text>
                  {new Date(filme.release_date).toLocaleDateString('pt-BR')}
                </Text>
              </Flex>
              <Flex align="center" gap={2} color="gray.400" fontSize="sm">
                <Icon as={FaClock} />
                <Text>{runtime}</Text>
              </Flex>
              {filme.homepage && (
                <Flex align="center" gap={2} color="gray.400" fontSize="sm">
                  <Icon as={FaGlobe} />
                  <Text
                    as="a"
                    href={filme.homepage}
                    target="_blank"
                    color="teal.400"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Site oficial
                  </Text>
                </Flex>
              )}
            </Flex>

            <Text
              color="gray.300"
              fontSize="md"
              lineHeight="tall"
              mb={6}
              maxW="700px"
            >
              {filme.overview}
            </Text>

            <Flex gap={3} flexWrap="wrap">
              <Button
                onClick={() => handleFavorite(filme)}
                colorPalette="teal"
                variant={isFavorite ? 'solid' : 'outline'}
                leftIcon={isFavorite ? <FaHeart /> : <FaRegHeart />}
              >
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
              <Button as={Link} to={-1} variant="ghost" color="gray.400">
                Voltar
              </Button>
            </Flex>
          </Box>
        </Flex>

        <Flex
          mt={12}
          gap={6}
          direction={{ base: 'column', md: 'row' }}
          flexWrap="wrap"
        >
          {(filme.budget > 0 || filme.revenue > 0) && (
            <Box bg="gray.900" borderRadius="xl" p={6} flex={1} minW="220px">
              <Text
                color="gray.500"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Finanças
              </Text>
              <Flex direction="column" gap={2}>
                <Flex justify="space-between">
                  <Text color="gray.400" fontSize="sm">
                    Orçamento
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="semibold">
                    {formatCurrency(filme.budget)}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.400" fontSize="sm">
                    Receita
                  </Text>
                  <Text color="teal.400" fontSize="sm" fontWeight="semibold">
                    {formatCurrency(filme.revenue)}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          )}

          {filme.production_companies?.length > 0 && (
            <Box bg="gray.900" borderRadius="xl" p={6} flex={2} minW="280px">
              <Text
                color="gray.500"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Produção
              </Text>
              <Flex gap={4} flexWrap="wrap" align="center">
                {filme.production_companies.map((company) => (
                  <Flex key={company.id} align="center" gap={2}>
                    {company.logo_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        h="24px"
                        objectFit="contain"
                        filter="brightness(0) invert(1)"
                        opacity={0.6}
                      />
                    ) : (
                      <Text color="gray.400" fontSize="sm">
                        {company.name}
                      </Text>
                    )}
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}

          {filme.belongs_to_collection && (
            <Box bg="gray.900" borderRadius="xl" p={6} flex={1} minW="220px">
              <Text
                color="gray.500"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={2}
              >
                Coleção
              </Text>
              <Text color="white" fontSize="sm" fontWeight="semibold">
                {filme.belongs_to_collection.name}
              </Text>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default DetalhesFilme;
