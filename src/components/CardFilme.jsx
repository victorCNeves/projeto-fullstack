import {
  Badge,
  Box,
  Button,
  Card,
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
} from 'react-icons/fa';
import { Link } from 'react-router';

const CardFilme = ({ filme }) => {
  const renderStars = (nota) => {
    const stars = [];
    const fullStars = Math.floor(nota / 2);
    const hasHalfStar = nota % 2 >= 1;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Icon key={i} as={FaStar} color="yellow.400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Icon key={i} as={FaStarHalfAlt} color="yellow.400" />);
      } else {
        stars.push(<Icon key={i} as={FaRegStar} color="gray.500" />);
      }
    }
    return stars;
  };

  const posterUrl = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;

  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      variant="subtle"
      bg="gray.900"
      transition="all 0.2s ease"
      _hover={{ transform: 'translateY(-10px)', cursor: 'pointer' }}
    >
      <Box position="relative">
        <Image
          src={posterUrl}
          alt={filme.title}
          fallbackSrc="https://placehold.co/500x700?text=No+Image"
          objectFit="cover"
          height="400px"
          width="100%"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            //TODO: adicionar/remover filme aos favoritos
          }}
          position="absolute"
          top="2"
          right="2"
          variant="ghost"
          colorPalette="teal"
          bg="blackAlpha.600"
          borderRadius="full"
          _hover={{ bg: 'blackAlpha.800' }}
        >
          {filme.is_favorite ? <FaHeart color="red" /> : <FaRegHeart />}
        </Button>
      </Box>

      <Card.Body gap="2" p="4">
        <Card.Title color="teal.500" truncate>
          {filme.title}
        </Card.Title>

        <Flex align="center" gap="1">
          {renderStars(filme.vote_average)}
          <Text textStyle="xs" color="gray.400" ml="1">
            ({filme.vote_count})
          </Text>
        </Flex>

        <Text textStyle="xs" color="gray.500">
          Lançamento: {new Date(filme.release_date).toLocaleDateString('pt-BR')}
        </Text>

        <Card.Description lineClamp={2} color="gray.300">
          {filme.overview}
        </Card.Description>

        <Flex wrap="wrap" gap="1" mt="2">
          {filme.genre_ids?.slice(0, 3).map((genero) => (
            <Badge
              key={genero.id}
              variant="outline"
              colorPalette="teal"
              size="sm"
            >
              {genero.name}
            </Badge>
          ))}
        </Flex>
      </Card.Body>

      <Card.Footer p="4" pt="0">
        <Button
          as={Link}
          to={`detalhes/${filme.id}`}
          variant="solid"
          colorPalette="teal"
          width="full"
        >
          Ver Detalhes
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default CardFilme;
