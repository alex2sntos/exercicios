import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Switch, Button, VStack, useToast,
} from '@chakra-ui/react';

const AutomationFlowForm = ({ isOpen, onClose, onSave, existingFlow, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (existingFlow) {
      setName(existingFlow.name || '');
      setDescription(existingFlow.description || '');
      setIsActive(existingFlow.isActive || false);
    } else {
      setName('');
      setDescription('');
      setIsActive(false);
    }
  }, [existingFlow, isOpen]);

  const handleSubmit = async () => {
    if (!name) {
      toast({ title: 'Nome do fluxo é obrigatório.', status: 'error', duration: 3000 });
      return;
    }
    await onSave({ name, description, isActive });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{existingFlow ? 'Editar Fluxo de Automação' : 'Criar Novo Fluxo de Automação'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="flow-name">Nome do Fluxo</FormLabel>
              <Input id="flow-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Boas-vindas Novo Cliente" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="flow-description">Descrição</FormLabel>
              <Textarea id="flow-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o objetivo deste fluxo..." />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="flow-isActive" mb="0">
                Ativar Fluxo?
              </FormLabel>
              <Switch id="flow-isActive" isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
            {existingFlow ? 'Salvar Alterações' : 'Criar Fluxo'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AutomationFlowForm;
