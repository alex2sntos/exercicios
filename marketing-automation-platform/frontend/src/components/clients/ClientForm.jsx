import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Select,
  Textarea, // Changed from Input for tags for better UX, though still simple
  useToast,
} from '@chakra-ui/react';
import { getClientStatuses } from '../../services/clientService'; // Assuming this exists

const ClientForm = ({ isOpen, onClose, onSave, existingClient, isLoading }) => {
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new',
    tags: '', // Storing tags as a comma-separated string for simplicity
  });
  const [statuses, setStatuses] = useState([]);
  const toast = useToast();

  useEffect(() => {
    getClientStatuses().then(setStatuses);
    if (existingClient) {
      setClient({
        name: existingClient.name || '',
        email: existingClient.email || '',
        phone: existingClient.phone || '',
        status: existingClient.status || 'new',
        tags: Array.isArray(existingClient.tags) ? existingClient.tags.join(', ') : '',
      });
    } else {
      // Reset for new client
      setClient({ name: '', email: '', phone: '', status: 'new', tags: '' });
    }
  }, [existingClient, isOpen]); // Rely on isOpen to reset form when re-opened for new

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!client.name && !client.email && !client.phone) {
        toast({
            title: 'Informação mínima requerida.',
            description: "Por favor, forneça nome, e-mail ou telefone.",
            status: 'warning',
            duration: 4000,
            isClosable: true,
        });
        return;
    }
    // Basic email validation
    if (client.email && !/\S+@\S+\.\S+/.test(client.email)) {
        toast({
            title: 'E-mail inválido.',
            description: "Por favor, insira um endereço de e-mail válido.",
            status: 'error',
            duration: 4000,
            isClosable: true,
        });
        return;
    }

    const clientDataToSave = {
        ...client,
        // Tags are already a string, service will handle splitting if necessary
    };
    await onSave(clientDataToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{existingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="name">Nome</FormLabel>
              <Input id="name" name="name" value={client.name} onChange={handleChange} placeholder="Nome completo do cliente" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <Input id="email" name="email" type="email" value={client.email} onChange={handleChange} placeholder="email@exemplo.com" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">Telefone</FormLabel>
              <Input id="phone" name="phone" type="tel" value={client.phone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select id="status" name="status" value={client.status} onChange={handleChange}>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="tags">Tags (separadas por vírgula)</FormLabel>
              <Textarea // Using Textarea for a bit more space for tags
                id="tags"
                name="tags"
                value={client.tags}
                onChange={handleChange}
                placeholder="vip, novo_lead, interessado_em_produto_x"
                rows={2}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
            {existingClient ? 'Salvar Alterações' : 'Salvar Cliente'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClientForm;
