import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, Textarea, Button, VStack, useToast, FormHelperText,
} from '@chakra-ui/react';
import { getTriggerTypes } from '../../services/automationFlowService';

const AutomationTriggerForm = ({ isOpen, onClose, onSave, existingTrigger, flowId, isLoading }) => {
  const [type, setType] = useState('');
  const [config, setConfig] = useState(''); // Storing JSON as string in Textarea
  const [availableTriggerTypes, setAvailableTriggerTypes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    getTriggerTypes().then(setAvailableTriggerTypes);
    if (existingTrigger) {
      setType(existingTrigger.type || '');
      setConfig(existingTrigger.config ? JSON.stringify(existingTrigger.config, null, 2) : '');
    } else {
      setType('');
      setConfig('');
    }
  }, [existingTrigger, isOpen]);

  const handleSubmit = async () => {
    if (!type) {
      toast({ title: 'Tipo do gatilho é obrigatório.', status: 'error', duration: 3000 });
      return;
    }
    let parsedConfig = {};
    if (config) {
      try {
        parsedConfig = JSON.parse(config);
      } catch (error) {
        toast({ title: 'Configuração JSON inválida.', description: error.message, status: 'error', duration: 5000 });
        return;
      }
    }
    await onSave({ type, config: parsedConfig });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{existingTrigger ? 'Editar Gatilho' : 'Adicionar Novo Gatilho'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="trigger-type">Tipo de Gatilho</FormLabel>
              <Select 
                id="trigger-type" 
                placeholder="Selecione o tipo de gatilho" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                {availableTriggerTypes.map(tt => <option key={tt.id} value={tt.id}>{tt.name}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="trigger-config">Configuração (JSON)</FormLabel>
              <Textarea 
                id="trigger-config" 
                value={config} 
                onChange={(e) => setConfig(e.target.value)} 
                placeholder='Ex: { "daysBeforeBirthday": 3 } ou { "campaignId": "uuid", "interactionType": "clicked_link" }'
                rows={5}
              />
              <FormHelperText>Insira um objeto JSON válido. Ex: {"{\"key\": \"value\"}"}</FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
            {existingTrigger ? 'Salvar Alterações' : 'Adicionar Gatilho'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AutomationTriggerForm;
