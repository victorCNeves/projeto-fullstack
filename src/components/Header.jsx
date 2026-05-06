import { Box, List, Link as ChrakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router';

const Header = () => {
  return (
    <Box as="header" padding="15px" bg="teal.900">
      <List.Root
        display="flex"
        flexDirection="row"
        gap="6"
        justifyContent="center"
        listStyle="none"
      >
        {['Home', 'Catalogo', 'Favoritados'].map((item, index) => (
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
    </Box>
  );
};

export default Header;
