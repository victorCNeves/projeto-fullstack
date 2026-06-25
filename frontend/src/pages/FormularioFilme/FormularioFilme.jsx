import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Textarea,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Form, useLoaderData, useNavigate, useNavigation } from 'react-router';

const FormularioFilme = () => {
  const loaderData = useLoaderData();
  const filme = loaderData?.filme || null;
  const genres = loaderData.genres;
  const isEditing = !!filme;

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formattedDate = filme?.release_date
    ? new Date(filme.release_date).toISOString().split('T')[0]
    : '';

  return (
    <Box bg="gray.950" minH="100vh" py={12} color="white">
      <Container maxW="container.md">
        <Box bg="gray.900" p={8} borderRadius="xl" boxShadow="xl">
          <Heading as="h1" size="xl" mb={6} color="teal.400">
            {isEditing ? 'Editar Filme' : 'Adicionar Novo Filme'}
          </Heading>

          <Form method={isEditing ? 'put' : 'post'}>
            <VStack gap={6} align="stretch">
              <Box>
                <Text mb={2} fontWeight="bold">
                  Título *
                </Text>
                <Input
                  name="title"
                  defaultValue={filme?.title}
                  placeholder="Ex: O Poderoso Chefão"
                  required
                  bg="gray.800"
                  borderColor="gray.700"
                />
              </Box>

              <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                <Box flex={1}>
                  <Text mb={2} fontWeight="bold">
                    Título Original
                  </Text>
                  <Input
                    name="original_title"
                    defaultValue={filme?.original_title}
                    placeholder="Ex: The Godfather"
                    bg="gray.800"
                    borderColor="gray.700"
                  />
                </Box>

                <Box flex={1}>
                  <Text mb={2} fontWeight="bold">
                    Idioma Original
                  </Text>
                  <Input
                    name="original_language"
                    defaultValue={filme?.original_language}
                    placeholder="Ex: en, pt, es"
                    maxLength={2}
                    bg="gray.800"
                    borderColor="gray.700"
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={2} fontWeight="bold">
                  Sinopse (Overview)
                </Text>
                <Textarea
                  name="overview"
                  defaultValue={filme?.overview}
                  placeholder="Descreva o filme..."
                  rows={4}
                  bg="gray.800"
                  borderColor="gray.700"
                />
              </Box>

              <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                <Box flex={1}>
                  <Text mb={2} fontWeight="bold">
                    Data de Lançamento
                  </Text>
                  <Input
                    type="date"
                    name="release_date"
                    defaultValue={formattedDate}
                    bg="gray.800"
                    borderColor="gray.700"
                  />
                </Box>

                <Box flex={1}>
                  <Text mb={2} fontWeight="bold">
                    Popularidade
                  </Text>
                  <Input
                    type="number"
                    step="0.001"
                    name="popularity"
                    defaultValue={filme?.popularity}
                    placeholder="Ex: 85.5"
                    bg="gray.800"
                    borderColor="gray.700"
                  />
                </Box>
              </Flex>

              <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                <Box flex={1}>
                  <Text mb={2} fontWeight="bold">
                    Média de Votos (0 a 10)
                  </Text>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    name="vote_average"
                    defaultValue={filme?.vote_average}
                    placeholder="Ex: 8.5"
                    bg="gray.800"
                    borderColor="gray.700"
                  />
                </Box>

                <Box flex={1}>
                  <Text mb={2} fontWeight="bold">
                    Total de Votos
                  </Text>
                  <Input
                    type="number"
                    name="vote_count"
                    defaultValue={filme?.vote_count}
                    placeholder="Ex: 1500"
                    bg="gray.800"
                    borderColor="gray.700"
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={3} fontWeight="bold">
                  Gêneros
                </Text>
                <Grid
                  templateColumns={{
                    base: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                  gap={3}
                >
                  {genres.map((genre) => (
                    <Box
                      as="label"
                      key={genre.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      cursor="pointer"
                    >
                      <input
                        type="checkbox"
                        name="genre_ids"
                        value={genre.id}
                        defaultChecked={filme?.genre_ids?.includes(genre.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#319795',
                        }}
                      />
                      <Text fontSize="sm">{genre.name}</Text>
                    </Box>
                  ))}
                </Grid>
              </Box>

              <VStack
                gap={4}
                align="stretch"
                p={4}
                bg="gray.800"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.700"
              >
                <Text fontWeight="bold" color="teal.300">
                  URLs de Imagens
                </Text>
                <Box>
                  <Text fontSize="sm" mb={1}>
                    Caminho do Pôster (Poster Path)
                  </Text>
                  <Input
                    name="poster_path"
                    defaultValue={filme?.poster_path}
                    placeholder="/caminho_da_imagem.jpg ou http..."
                    bg="gray.900"
                    borderColor="gray.700"
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>
                    Caminho do Fundo (Backdrop Path)
                  </Text>
                  <Input
                    name="backdrop_path"
                    defaultValue={filme?.backdrop_path}
                    placeholder="/caminho_da_imagem.jpg ou http..."
                    bg="gray.900"
                    borderColor="gray.700"
                  />
                </Box>
              </VStack>

              <Flex gap={4} mt={6} justify="flex-end">
                <Button
                  variant="ghost"
                  color="gray.400"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorPalette="teal"
                  loading={isSubmitting}
                  loadingText="Salvando..."
                >
                  {isEditing ? 'Salvar Alterações' : 'Criar Filme'}
                </Button>
              </Flex>
            </VStack>
          </Form>
        </Box>
      </Container>
    </Box>
  );
};

export default FormularioFilme;
