import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, Textarea, Button, VStack, Input, NumberInput, 
  NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, 
  useToast, FormHelperText, HStack,
} from '@chakra-ui/react';
import { getActionTypes } from '../../services/automationFlowService';

const AutomationActionForm = ({ isOpen, onClose, onSave, existingAction, flowId, isLoading }) => {
  const [type, setType] = useState('');
  const [config, setConfig] = useState('');
  const [order, setOrder] = useState(1);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [availableActionTypes, setAvailableActionTypes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    getActionTypes().then(setAvailableActionTypes);
    if (existingAction) {
      setType(existingAction.type || '');
      setConfig(existingAction.config ? JSON.stringify(existingAction.config, null, 2) : '');
      setOrder(existingAction.order || 1);
      setDelayMinutes(existingAction.delayMinutes || 0);
    } else {
      setType('');
      setConfig('');
      setOrder(1); // Default order for new action, could be smarter (e.g., next available order)
      setDelayMinutes(0);
    }
  }, [existingAction, isOpen]);

  const handleSubmit = async () => {
    if (!type) {
      toast({ title: 'Tipo da ação é obrigatório.', status: 'error', duration: 3000 });
      return;
    }
    let parsedConfig = {};
    if (config) { // Config might be optional for some actions, but usually required
      try {
        parsedConfig = JSON.parse(config);
      } catch (error) {
        toast({ title: 'Configuração JSON inválida.', description: error.message, status: 'error', duration: 5000 });
        return;
      }
    } else {
        // Some actions might not need config, or have default empty {}
        // For now, let's assume config is generally needed or can be an empty object
         toast({ title: 'Configuração é recomendada.', description: 'Mesmo que vazia {}, a configuração é geralmente esperada.', status: 'info', duration: 4000 });
    }

    await onSave({ type, config: parsedConfig, order: Number(order), delayMinutes: Number(delayMinutes) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{existingAction ? 'Editar Ação' : 'Adicionar Nova Ação'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="action-type">Tipo de Ação</FormLabel>
              <Select 
                id="action-type" 
                placeholder="Selecione o tipo de ação" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                {availableActionTypes.map(at => <option key={at.id} value={at.id}>{at.name}</option>)}
              </Select>
            </FormControl>
            <FormControl isRequired> {/* Making config required for now, can be adjusted */}
              <FormLabel htmlFor="action-config">Configuração (JSON)</FormLabel>
              <Textarea 
                id="action-config" 
                value={config} 
                onChange={(e) => setConfig(e.target.value)} 
                placeholder='Ex: { "emailTemplateId": "uuid" } ou { "socialPostContent": "Olá!", "platform": "instagram" }'
                rows={5}
              />
              <FormHelperText>Insira um objeto JSON válido. Ex: {"{\"key\": \"value\"}"}</FormHelperText>
            </FormControl>
            <HStack width="100%">
              <FormControl isRequired>
                <FormLabel htmlFor="action-order">Ordem</FormLabel>
                <NumberInput min={1} value={order} onChange={(valueString) => setOrder(parseInt(valueString, 10))}>
                  <NumberInputField id="action-order" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Ordem de execução da ação no fluxo.</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="action-delay">Atraso (minutos)</FormLabel>
                <NumberInput min={0} value={delayMinutes} onChange={(valueString) => setDelayMinutes(parseInt(valueString, 10))}>
                  <NumberInputField id="action-delay" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput
                ><FormHelperText>Atraso antes de executar esta ação.</FormHelperText>
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
            {existingAction ? 'Salvar Alterações' : 'Adicionar Ação'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AutomationActionForm;
