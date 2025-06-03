import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Button, Flex, VStack, HStack, Text, SimpleGrid,
  List, ListItem, ListIcon, IconButton, useToast, Spinner, Alert, AlertIcon,
  Switch, Tag, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  useDisclosure, Divider, Tooltip, Badge, Code, Kbd,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiPlayCircle, FiPauseCircle, FiChevronsRight, FiZap, FiSend } from 'react-icons/fi'; // Added more icons
import * as API from '../services/automationFlowService'; // Using * as API for brevity
import AutomationFlowForm from '../components/automations/AutomationFlowForm';
import AutomationTriggerForm from '../components/automations/AutomationTriggerForm';
import AutomationActionForm from '../components/automations/AutomationActionForm';

const AutomationFlowsPage = () => {
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Modal states
  const { isOpen: isFlowModalOpen, onOpen: onFlowModalOpen, onClose: onFlowModalClose } = useDisclosure();
  const [editingFlow, setEditingFlow] = useState(null);

  const { isOpen: isTriggerModalOpen, onOpen: onTriggerModalOpen, onClose: onTriggerModalClose } = useDisclosure();
  const [editingTrigger, setEditingTrigger] = useState(null);

  const { isOpen: isActionModalOpen, onOpen: onActionModalOpen, onClose: onActionModalClose } = useDisclosure();
  const [editingAction, setEditingAction] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);


  const fetchFlows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await API.getAutomationFlows();
      setFlows(data);
    } catch (err) {
      setError('Falha ao carregar fluxos.');
      toast({ title: 'Erro', description: err.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const handleSelectFlow = async (flowId) => {
    if (selectedFlow?.id === flowId) { // Deselect if clicking the same flow
        setSelectedFlow(null);
        return;
    }
    setIsDetailLoading(true);
    try {
      const data = await API.getAutomationFlowById(flowId);
      setSelectedFlow(data);
    } catch (err) {
      toast({ title: 'Erro ao carregar detalhes do fluxo', description: err.message, status: 'error' });
      setSelectedFlow(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Flow CRUD
  const handleOpenFlowModal = (flow = null) => {
    setEditingFlow(flow);
    onFlowModalOpen();
  };
  const handleSaveFlow = async (data) => {
    setIsSaving(true);
    try {
      if (editingFlow) {
        const updatedFlow = await API.updateAutomationFlow(editingFlow.id, data);
        setFlows(prev => prev.map(f => (f.id === updatedFlow.id ? updatedFlow : f)));
        if (selectedFlow?.id === updatedFlow.id) setSelectedFlow(updatedFlow); // Update selected flow details
      } else {
        const newFlow = await API.createAutomationFlow(data);
        setFlows(prev => [newFlow, ...prev]);
      }
      toast({ title: `Fluxo ${editingFlow ? 'atualizado' : 'criado'}!`, status: 'success' });
      onFlowModalClose();
    } catch (err) {
      toast({ title: 'Erro ao salvar fluxo', description: err.message, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  const handleRemoveFlow = async (flowId, e) => {
    e.stopPropagation(); // Prevent selecting the flow
    if (window.confirm('Tem certeza que deseja remover este fluxo e todos os seus gatilhos e ações?')) {
        try {
            await API.removeAutomationFlow(flowId);
            toast({ title: 'Fluxo removido!', status: 'success' });
            setFlows(prev => prev.filter(f => f.id !== flowId));
            if (selectedFlow?.id === flowId) setSelectedFlow(null);
        } catch (err) {
            toast({ title: 'Erro ao remover fluxo', description: err.message, status: 'error' });
        }
    }
  };
   const handleToggleFlowStatus = async (flow, e) => {
    e.stopPropagation();
    const newStatus = !flow.isActive;
    try {
        const updatedFlow = await API.updateAutomationFlow(flow.id, { isActive: newStatus });
        setFlows(prev => prev.map(f => (f.id === updatedFlow.id ? updatedFlow : f)));
        if (selectedFlow?.id === updatedFlow.id) setSelectedFlow(prev => ({...prev, isActive: newStatus}));
        toast({ title: `Fluxo ${newStatus ? 'ativado' : 'desativado'}`, status: 'info' });
    } catch (error) {
        toast({ title: 'Erro ao alterar status', description: error.message, status: 'error'});
    }
  };


  // Trigger CRUD
  const handleOpenTriggerModal = (trigger = null) => {
    setEditingTrigger(trigger);
    onTriggerModalOpen();
  };
  const handleSaveTrigger = async (data) => {
    setIsSaving(true);
    try {
      let savedTrigger;
      if (editingTrigger) {
        savedTrigger = await API.updateTrigger(editingTrigger.id, data);
      } else {
        savedTrigger = await API.addTriggerToFlow(selectedFlow.id, data);
      }
      // Refresh selected flow to show new/updated trigger
      handleSelectFlow(selectedFlow.id); 
      toast({ title: `Gatilho ${editingTrigger ? 'atualizado' : 'adicionado'}!`, status: 'success' });
      onTriggerModalClose();
    } catch (err) {
      toast({ title: 'Erro ao salvar gatilho', description: err.message, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  const handleRemoveTrigger = async (triggerId) => {
     if (window.confirm('Remover este gatilho?')) {
        try {
            await API.removeTrigger(selectedFlow.id, triggerId);
            toast({ title: 'Gatilho removido!', status: 'success' });
            handleSelectFlow(selectedFlow.id); // Refresh
        } catch (err) {
            toast({ title: 'Erro ao remover gatilho', description: err.message, status: 'error' });
        }
    }
  };

  // Action CRUD
  const handleOpenActionModal = (action = null) => {
    setEditingAction(action);
    onActionModalOpen();
  };
  const handleSaveAction = async (data) => {
    setIsSaving(true);
    try {
      let savedAction;
      if (editingAction) {
        savedAction = await API.updateAction(editingAction.id, data);
      } else {
        // Ensure order is unique or handle reordering if necessary (mock service might not enforce)
        savedAction = await API.addActionToFlow(selectedFlow.id, data);
      }
      handleSelectFlow(selectedFlow.id); // Refresh
      toast({ title: `Ação ${editingAction ? 'atualizada' : 'adicionada'}!`, status: 'success' });
      onActionModalClose();
    } catch (err) {
      toast({ title: 'Erro ao salvar ação', description: err.message, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  const handleRemoveAction = async (actionId) => {
    if (window.confirm('Remover esta ação?')) {
        try {
            await API.removeAction(selectedFlow.id, actionId);
            toast({ title: 'Ação removida!', status: 'success' });
            handleSelectFlow(selectedFlow.id); // Refresh
        } catch (err) {
            toast({ title: 'Erro ao remover ação', description: err.message, status: 'error' });
        }
    }
  };


  if (isLoading) return <Box display="flex" justifyContent="center" my={10}><Spinner size="xl" /></Box>;
  if (error) return <Alert status="error" my={5}><AlertIcon />{error}</Alert>;

  return (
    <Flex direction={{ base: 'column', md: 'row' }} p={5} gap={6} minH="calc(100vh - 150px)">
      {/* Flows List Column */}
      <VStack flex={{ base: '1', md: '0.4' }} spacing={4} align="stretch" p={4} borderWidth="1px" borderRadius="md" shadow="sm" bg="gray.50" h="100%">
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Heading size="lg">Meus Fluxos</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" size="sm" onClick={() => handleOpenFlowModal()}>Novo Fluxo</Button>
        </Flex>
        {flows.length === 0 && <Text>Nenhum fluxo criado ainda.</Text>}
        <List spacing={3} overflowY="auto" maxHeight="calc(100vh - 250px)">
          {flows.map(flow => (
            <ListItem 
              key={flow.id} 
              p={3} 
              borderWidth="1px" 
              borderRadius="md" 
              shadow={selectedFlow?.id === flow.id ? "md" : "xs"} 
              bg={selectedFlow?.id === flow.id ? "blue.50" : "white"}
              onClick={() => handleSelectFlow(flow.id)} 
              cursor="pointer"
              _hover={{ shadow: 'md', bg: selectedFlow?.id === flow.id ? "blue.100" : "gray.100" }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Text fontWeight="bold">{flow.name}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>{flow.description || 'Sem descrição'}</Text>
                </Box>
                <HStack spacing={1}>
                    <Tooltip label={flow.isActive ? "Desativar Fluxo" : "Ativar Fluxo"}>
                        <IconButton 
                            icon={flow.isActive ? <FiPauseCircle /> : <FiPlayCircle />} 
                            size="xs" 
                            variant="ghost"
                            colorScheme={flow.isActive ? "yellow" : "green"}
                            onClick={(e) => handleToggleFlowStatus(flow, e)}
                            aria-label="Toggle Status"
                        />
                    </Tooltip>
                    <Tooltip label="Editar Fluxo">
                        <IconButton icon={<FiEdit2 />} size="xs" variant="ghost" onClick={(e) => {e.stopPropagation(); handleOpenFlowModal(flow);}} aria-label="Editar Fluxo"/>
                    </Tooltip>
                    <Tooltip label="Remover Fluxo">
                        <IconButton icon={<FiTrash2 />} size="xs" variant="ghost" colorScheme="red" onClick={(e) => handleRemoveFlow(flow.id, e)} aria-label="Remover Fluxo"/>
                    </Tooltip>
                </HStack>
              </Flex>
               <Tag size="sm" colorScheme={flow.isActive ? 'green' : 'red'} mt={2}>{flow.isActive ? 'Ativo' : 'Inativo'}</Tag>
            </ListItem>
          ))}
        </List>
      </VStack>

      {/* Selected Flow Details Column */}
      <VStack flex={{ base: '1', md: '0.6' }} spacing={4} align="stretch" p={4} borderWidth="1px" borderRadius="md" shadow="sm" bg="white" h="100%" overflowY="auto">
        {!selectedFlow && <Text color="gray.500" textAlign="center" mt={10}>Selecione um fluxo da lista para ver seus detalhes ou crie um novo.</Text>}
        {isDetailLoading && <Box display="flex" justifyContent="center" my={10}><Spinner size="lg" /></Box>}
        
        {selectedFlow && !isDetailLoading && (
          <>
            <Heading size="lg" color="blue.700">{selectedFlow.name}</Heading>
            <Text fontSize="md" color="gray.700">{selectedFlow.description}</Text>
            <Badge colorScheme={selectedFlow.isActive ? 'green' : 'red'}>{selectedFlow.isActive ? 'Ativo' : 'Inativo'}</Badge>
            <Divider my={4}/>

            <Accordion allowMultiple defaultIndex={[0, 1]}> {/* Open both by default */}
              {/* Triggers Section */}
              <AccordionItem>
                <h2>
                  <AccordionButton _expanded={{ bg: 'blue.100', color: 'blue.800' }}>
                    <Box flex="1" textAlign="left" fontWeight="bold"><Icon as={FiZap} mr={2}/>Gatilhos ({selectedFlow.triggers?.length || 0})</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Button leftIcon={<FiPlus />} size="sm" colorScheme="teal" mb={3} onClick={() => handleOpenTriggerModal()}>Adicionar Gatilho</Button>
                  {selectedFlow.triggers?.length === 0 && <Text fontSize="sm">Nenhum gatilho configurado.</Text>}
                  <List spacing={3}>
                    {selectedFlow.triggers?.map(trigger => (
                      <ListItem key={trigger.id} p={2} borderWidth="1px" borderRadius="md" bg="gray.50">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Box>
                                <Text fontWeight="semibold">{API.mockTriggerTypes.find(t => t.id === trigger.type)?.name || trigger.type}</Text>
                                <Code colorScheme="gray" fontSize="xs" p={1} mt={1} display="block" whiteSpace="pre-wrap">
                                    {trigger.config ? JSON.stringify(trigger.config) : 'Sem config.'}
                                </Code>
                            </Box>
                            <HStack>
                                <IconButton icon={<FiEdit2 />} size="xs" variant="ghost" onClick={() => handleOpenTriggerModal(trigger)} aria-label="Editar Gatilho"/>
                                <IconButton icon={<FiTrash2 />} size="xs" variant="ghost" colorScheme="red" onClick={() => handleRemoveTrigger(trigger.id)} aria-label="Remover Gatilho"/>
                            </HStack>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>

              {/* Actions Section */}
              <AccordionItem>
                <h2>
                  <AccordionButton _expanded={{ bg: 'purple.100', color: 'purple.800' }}>
                    <Box flex="1" textAlign="left" fontWeight="bold"><Icon as={FiSend} mr={2}/>Ações ({selectedFlow.actions?.length || 0})</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Button leftIcon={<FiPlus />} size="sm" colorScheme="purple" mb={3} onClick={() => handleOpenActionModal()}>Adicionar Ação</Button>
                  {selectedFlow.actions?.length === 0 && <Text fontSize="sm">Nenhuma ação configurada.</Text>}
                  <List spacing={3}>
                    {selectedFlow.actions?.map(action => (
                      <ListItem key={action.id} p={2} borderWidth="1px" borderRadius="md" bg="gray.50">
                        <Flex justifyContent="space-between" alignItems="center" >
                            <Box>
                                <Text fontWeight="semibold">#{action.order}: {API.mockActionTypes.find(a => a.id === action.type)?.name || action.type}</Text>
                                {action.delayMinutes > 0 && <Text fontSize="xs" color="gray.500">Atraso: {action.delayMinutes} min</Text>}
                                <Code colorScheme="gray" fontSize="xs" p={1} mt={1} display="block" whiteSpace="pre-wrap">
                                    {action.config ? JSON.stringify(action.config) : 'Sem config.'}
                                </Code>
                            </Box>
                             <HStack>
                                <IconButton icon={<FiEdit2 />} size="xs" variant="ghost" onClick={() => handleOpenActionModal(action)} aria-label="Editar Ação"/>
                                <IconButton icon={<FiTrash2 />} size="xs" variant="ghost" colorScheme="red" onClick={() => handleRemoveAction(action.id)} aria-label="Remover Ação"/>
                            </HStack>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </VStack>

      {/* Modals for Forms */}
      {isFlowModalOpen && <AutomationFlowForm isOpen={isFlowModalOpen} onClose={onFlowModalClose} onSave={handleSaveFlow} existingFlow={editingFlow} isLoading={isSaving} />}
      {isTriggerModalOpen && selectedFlow && <AutomationTriggerForm isOpen={isTriggerModalOpen} onClose={onTriggerModalClose} onSave={handleSaveTrigger} existingTrigger={editingTrigger} flowId={selectedFlow.id} isLoading={isSaving} />}
      {isActionModalOpen && selectedFlow && <AutomationActionForm isOpen={isActionModalOpen} onClose={onActionModalClose} onSave={handleSaveAction} existingAction={editingAction} flowId={selectedFlow.id} isLoading={isSaving} />}
    </Flex>
  );
};

export default AutomationFlowsPage;
