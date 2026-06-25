import { logout } from '@/utils/authUtils';
import { Box, List, Link as ChrakraLink, Button } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router';

const Header = () => {
  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <Box
      as="header"
      padding="15px"
      bg="teal.900"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box width="80px" display={{ base: 'none', md: 'block' }} />

      <List.Root
        display="flex"
        flexDirection="row"
        gap="6"
        justifyContent="center"
        listStyle="none"
        flex="1"
      >
        {['Home', 'Catalogo', 'Adicionar'].map((item, index) => (
          <List.Item key={index}>
            <ChrakraLink
              as={ReactRouterLink}
              to={item.toLowerCase() != 'home' ? item.toLowerCase() : '/'}
            >
              {item}
            </ChrakraLink>
          </List.Item>
        ))}
      </List.Root>

      <Button
        colorPalette="red"
        variant="ghost"
        size="sm"
        _hover={{ bg: 'red.600', color: 'white' }}
        onClick={handleLogout}
      >
        Sair
      </Button>
    </Box>
  );
};

export default Header;
