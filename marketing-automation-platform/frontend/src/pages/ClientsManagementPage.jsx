import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Spacer,
  HStack,
  Select,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import ClientForm from '../components/clients/ClientForm';
import { getClients, createClient, updateClient, deleteClient, getAvailableTags, getClientStatuses } from '../services/clientService';

const ClientsManagementPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For ClientForm Modal
  const [editingClient, setEditingClient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const [availableTags, setAvailableTags] = useState([]);
  const [clientStatuses, setClientStatuses] = useState([]);

  const toast = useToast();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClients({ searchTerm, status: statusFilter, tag: tagFilter });
      setClients(data);
      setFilteredClients(data); // Initially, filtered is same as all
    } catch (err) {
      setError('Falha ao carregar clientes.');
      toast({ title: 'Erro ao carregar clientes', description: err.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, searchTerm, statusFilter, tagFilter]); // Dependencies for useCallback

  useEffect(() => {
    fetchClients();
    getAvailableTags().then(setAvailableTags);
    getClientStatuses().then(setClientStatuses);
  }, [fetchClients]);


  const handleAddClient = () => {
    setEditingClient(null);
    onOpen();
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    onOpen();
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      try {
        await deleteClient(clientId);
        toast({ title: 'Cliente removido', status: 'success' });
        fetchClients(); // Refresh list
      } catch (err) {
        toast({ title: 'Erro ao remover cliente', description: err.message, status: 'error' });
      }
    }
  };

  const handleSaveClient = async (clientData) => {
    setIsSaving(true);
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
        toast({ title: 'Cliente atualizado', status: 'success' });
      } else {
        await createClient(clientData);
        toast({ title: 'Cliente criado', status: 'success' });
      }
      onClose();
      fetchClients(); // Refresh list
    } catch (err) {
      toast({ title: 'Erro ao salvar cliente', description: err.message, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Simple pagination (can be improved with a library or more complex state)
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <Box p={5}>
      <Flex mb={6} alignItems="center">
        <Heading>Gerenciamento de Clientes</Heading>
        <Spacer />
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleAddClient}>
          Adicionar Novo Cliente
        </Button>
      </Flex>

      <HStack spacing={4} mb={6} flexWrap="wrap">
        <InputGroup maxW={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input 
                type="text" 
                placeholder="Buscar por nome ou e-mail..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchClients()}
            />
        </InputGroup>
        <Select 
            placeholder="Filtrar por status" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW={{ base: "100%", md: "200px" }}
        >
            <option value="">Todos os Status</option>
            {clientStatuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <Select 
            placeholder="Filtrar por tag" 
            value={tagFilter} 
            onChange={(e) => setTagFilter(e.target.value)}
            maxW={{ base: "100%", md: "200px" }}
        >
            <option value="">Todas as Tags</option>
            {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </Select>
        <Button leftIcon={<FiFilter />} onClick={fetchClients} colorScheme="gray">Aplicar Filtros</Button>
      </HStack>

      {isLoading && <Box display="flex" justifyContent="center" my={10}><Spinner size="xl" /></Box>}
      {error && <Alert status="error" my={5}><AlertIcon />{error}</Alert>}
      
      {!isLoading && !error && (
        <>
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>E-mail</Th>
                  <Th>Telefone</Th>
                  <Th>Status</Th>
                  <Th>Tags</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentClients.map(client => (
                  <Tr key={client.id}>
                    <Td>{client.name || '-'}</Td>
                    <Td>{client.email || '-'}</Td>
                    <Td>{client.phone || '-'}</Td>
                    <Td><Tag colorScheme={client.status === 'active' ? 'green' : client.status === 'new' ? 'blue' : 'gray'}>{clientStatuses.find(s => s.id === client.status)?.name || client.status}</Tag></Td>
                    <Td>
                      <Wrap spacing={1}>
                        {client.tags && client.tags.map(tag => (
                          <WrapItem key={tag}><Tag size="sm" colorScheme="purple" variant="solid">{tag}</Tag></WrapItem>
                        ))}
                      </Wrap>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton icon={<FiEdit />} aria-label="Editar Cliente" size="sm" variant="ghost" colorScheme="blue" onClick={() => handleEditClient(client)} />
                        <IconButton icon={<FiTrash2 />} aria-label="Remover Cliente" size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteClient(client.id)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Flex justifyContent="center" mt={6}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button 
                  key={page} 
                  onClick={() => paginate(page)}
                  isActive={currentPage === page}
                  mx={1}
                  size="sm"
                >
                  {page}
                </Button>
              ))}
            </Flex>
          )}
           {currentClients.length === 0 && <Text textAlign="center" mt={10}>Nenhum cliente encontrado com os filtros atuais.</Text>}
        </>
      )}

      <ClientForm 
        isOpen={isOpen} 
        onClose={onClose} 
        onSave={handleSaveClient} 
        existingClient={editingClient}
        isLoading={isSaving}
      />
    </Box>
  );
};

export default ClientsManagementPage;
