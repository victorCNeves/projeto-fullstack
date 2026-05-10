import {
  Box,
  Input,
  Select,
  Stack,
  Button,
  Text,
  Flex,
  Portal,
  Link,
  createListCollection,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const ContainerBusca = ({ generos }) => {
  const collection = useMemo(
    () =>
      createListCollection({
        items: generos.map((genero) => ({
          value: genero.name,
          name: genero.name,
        })),
      }),
    [generos]
  );
  const [busca, setBusca] = useState('');
  const [genero, setGenero] = useState([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const handleFiltrar = () => {};

  return (
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
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            _focus={{ ring: 2, ringColor: 'teal.500' }}
          />
        </Box>

        <Box flex="1">
          <Flex justify="space-between" align="center" mb={2}>
            <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
              Gênero
            </Text>
            {genero.length > 0 && (
              <Link
                color="teal.400"
                fontSize="xs"
                onClick={() => setGenero([])}
                style={{ cursor: 'pointer', textDecoration: 'none' }}
                _hover={{ color: 'teal.300' }}
              >
                Limpar
              </Link>
            )}
          </Flex>
          <Select.Root
            collection={collection}
            size="sm"
            width="320px"
            value={genero}
            onValueChange={(details) => setGenero(details.value)}
          >
            <Select.HiddenSelect />
            <Select.Label>Selecione um gênero</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Selecione um gênero" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {collection.items.map((c) => (
                    <Select.Item item={c} key={c.value}>
                      {c.name}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        <Box flex="1">
          <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
            Data Inicial de Lançamento
          </Text>
          <Input
            type="date"
            bg="gray.800"
            border="none"
            color="white"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            css={{
              '&::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)',
              },
            }}
          />
        </Box>

        <Box flex="1">
          <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
            Data Final de Lançamento
          </Text>
          <Input
            type="date"
            bg="gray.800"
            border="none"
            color="white"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            css={{
              '&::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)',
              },
            }}
          />
        </Box>

        <Button
          colorPalette="teal"
          px={8}
          leftIcon={<FaSearch />}
          onClick={handleFiltrar}
        >
          Filtrar
        </Button>
      </Flex>
    </Stack>
  );
};

export default ContainerBusca;
