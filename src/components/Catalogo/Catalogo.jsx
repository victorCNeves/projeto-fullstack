import { useLoaderData } from 'react-router';
import CardFilme from '@/components/CardFilme';
import {
  Box,
  Container,
  SimpleGrid,
  Input,
  Select,
  Stack,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const Catalogo = () => {
  const { filmes, generos } = useLoaderData();

  return (
    <Box bg="black" minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Stack gap={8} mb={10}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={4}
            bg="gray.900"
            p={6}
            borderRadius="xl"
            align="flex-end"
          >
            <Box flex="2">
              <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
                Busca
              </Text>
              <Input
                placeholder="Nome do filme..."
                bg="gray.800"
                border="none"
                color="white"
                _focus={{ ring: 2, ringColor: 'teal.500' }}
              />
            </Box>

            <Box flex="1">
              <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
                Gênero
              </Text>
              <Select.Root>
                <Select.HiddenSelect />
                <Select.Label>Selecione o gênero</Select.Label>

                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Selecione o gênero" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                    <Select.ClearTrigger />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                  <Select.Content>
                    {generos.map((genero) => (
                      <Select.Item item={genero} key={genero.id}>
                        {genero.name}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Box>

            <Box flex="1">
              <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
                Lançamento
              </Text>
              <Input
                type="date"
                bg="gray.800"
                border="none"
                color="white"
                css={{
                  '&::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',
                  },
                }}
              />
            </Box>

            <Button colorPalette="teal" px={8} leftIcon={<FaSearch />}>
              Filtrar
            </Button>
          </Flex>
        </Stack>

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
