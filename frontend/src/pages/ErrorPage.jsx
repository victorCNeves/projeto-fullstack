import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useRouteError, Link as RouterLink } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Box textAlign="center" py={10} px={6}>
      <VStack spacing={4}>
        <Heading fontSize="6xl" color="red.500">
          {error.status || 'Erro'}
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Ops! Algo deu errado.
        </Text>
        <Text color={'gray.500'} mb={6}>
          {error.statusText || error.message || 'Página não encontrada.'}
        </Text>

        <Button as={RouterLink} to="/" fontWeight="bolder">
          Ir para Home
        </Button>
      </VStack>
    </Box>
  );
};

export default ErrorPage;
