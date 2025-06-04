import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

const EmailForm = ({ campaignId, existingEmail, onSave, onCancel }) => {
  const [subject, setSubject] = useState(existingEmail?.subject || '');
  const [body, setBody] = useState(existingEmail?.body || '');
  const [recipientEmail, setRecipientEmail] = useState(existingEmail?.recipientEmail || '');
  const [scheduledAt, setScheduledAt] = useState(existingEmail?.scheduledAt ? existingEmail.scheduledAt.substring(0, 16) : '');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (existingEmail) {
      setSubject(existingEmail.subject);
      setBody(existingEmail.body);
      setRecipientEmail(existingEmail.recipientEmail);
      setScheduledAt(existingEmail.scheduledAt ? existingEmail.scheduledAt.substring(0, 16) : '');
    }
  }, [existingEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!subject || !body || !recipientEmail || !scheduledAt) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Assunto, Corpo, Destinatário e Data de Agendamento são obrigatórios.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
    try {
      await onSave({ subject, body, recipientEmail, scheduledAt: new Date(scheduledAt).toISOString() });
      // Reset or close modal
    } catch (error) {
      toast({
        title: 'Erro ao salvar e-mail',
        description: error.message || 'Ocorreu um erro inesperado.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
      <Heading size="md" mb={4}>{existingEmail ? 'Editar E-mail' : 'Adicionar Novo E-mail'}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="recipientEmail">E-mail do Destinatário</FormLabel>
            <Input 
              id="recipientEmail" 
              type="email" 
              value={recipientEmail} 
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="cliente@exemplo.com" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="subject">Assunto</FormLabel>
            <Input 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Assunto do seu e-mail"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="body">Corpo do E-mail</FormLabel>
            <Textarea 
              id="body" 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              placeholder="Escreva o conteúdo do seu e-mail aqui... (Placeholder para editor drag-and-drop)"
              rows={10}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="scheduledAtEmail">Data de Agendamento</FormLabel>
            <Input 
              id="scheduledAtEmail" 
              type="datetime-local" 
              value={scheduledAt} 
              onChange={(e) => setScheduledAt(e.target.value)} 
            />
          </FormControl>
           <Text fontSize="xs" color="gray.500" mt={1}>Selecione uma data e hora para o e-mail ser enviado.</Text>
          <Box>
            <Button type="submit" colorScheme="blue" isLoading={isLoading} mr={3}>
              {existingEmail ? 'Salvar Alterações' : 'Adicionar E-mail'}
            </Button>
            {onCancel && <Button variant="ghost" onClick={onCancel}>Cancelar</Button>}
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default EmailForm;
