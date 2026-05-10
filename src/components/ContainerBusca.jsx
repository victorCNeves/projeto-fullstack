import {
  Box,
  Input,
  Select,
  Stack,
  Button,
  Text,
  Flex,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
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
            _focus={{ ring: 2, ringColor: 'teal.500' }}
          />
        </Box>

        <Box flex="1">
          <Text color="gray.300" mb={2} fontSize="sm" fontWeight="bold">
            Gênero
          </Text>
          <Select.Root collection={generos} size="sm" width="320px">
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
                  {generos.items.map((genero) => (
                    <Select.Item item={genero} key={genero.value}>
                      {genero.name}
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
  );
};

export default ContainerBusca;
