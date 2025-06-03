import React from 'react';
import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react'; // Added Button
import { Link as RouterLink } from 'react-router-dom';

const Header = () => (
  <Flex as="header" p="4" bg="brand.700" color="white" alignItems="center">
    <Heading size="md" as={RouterLink} to="/">
      Marketing Automation Platform
    </Heading>
    <Spacer />
    <Button as={RouterLink} to="/clients" colorScheme="whiteAlpha" variant="ghost" size="sm" mr={2}>
      Clientes
    </Button>
    <Button as={RouterLink} to="/automations" colorScheme="whiteAlpha" variant="ghost" size="sm" mr={2}>
      Automações
    </Button>
    <Button as={RouterLink} to="/campaigns/new" colorScheme="whiteAlpha" variant="outline" size="sm" mr={2}>
      Nova Campanha
    </Button>
    <Button as={RouterLink} to="/settings" colorScheme="whiteAlpha" variant="ghost" size="sm" mr={4}>
      Configurações
    </Button>
    {/* <Button as={RouterLink} to="/login" variant="outline" colorScheme="whiteAlpha">Login</Button> */}
  </Flex>
);

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" flex="1" p="4">
        {children}
      </Box>
      <Box as="footer" p="4" bg="gray.100" textAlign="center">
        <small>&copy; {new Date().getFullYear()} Marketing Automation Platform. Todos os direitos reservados.</small>
      </Box>
    </Flex>
  );
};

export default Layout;
