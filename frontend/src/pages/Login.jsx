import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react';
import { login } from '@/utils/authUtils';

const Login = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(username, senha);

      navigate('/');
    } catch (err) {
      setErro(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Flex minH="85vh" align="center" justify="center" bg="black" px={4}>
      <Box
        w="full"
        maxW="md"
        bg="gray.900"
        border="1px solid"
        borderColor="teal.800"
        borderRadius="lg"
        p={8}
        boxShadow="2xl"
      >
        <Stack gap={6} as="form" onSubmit={handleSubmit}>
          <Box textAlign="center">
            <Heading size="2xl" color="teal.500" mb={2}>
              CineApp
            </Heading>
            <Text color="gray.400" size="sm">
              Insira suas credenciais para acessar o catálogo
            </Text>
          </Box>

          {erro && (
            <Box
              bg="red.950"
              border="1px solid"
              borderColor="red.800"
              p={3}
              borderRadius="md"
            >
              <Text
                color="red.400"
                fontSize="sm"
                textAlign="center"
                fontWeight="medium"
              >
                {erro}
              </Text>
            </Box>
          )}

          <Stack gap={4}>
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.300">
                Usuário
              </Text>
              <Input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="black"
                borderColor="teal.900"
                _focus={{ borderColor: 'teal.500', boxShadow: 'none' }}
                required
                disabled={carregando}
              />
            </Box>

            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.300">
                Senha
              </Text>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                bg="black"
                borderColor="teal.900"
                _focus={{ borderColor: 'teal.500', boxShadow: 'none' }}
                required
                disabled={carregando}
              />
            </Box>
          </Stack>

          <Button
            type="submit"
            colorPalette="teal"
            variant="solid"
            w="full"
            mt={2}
            loading={carregando}
            _hover={{ bg: 'teal.600' }}
          >
            Entrar
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;
