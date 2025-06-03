import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { getSocialPlatforms } from '../../services/campaignService'; // Assuming this exists

const SocialPostForm = ({ campaignId, existingPost, onSave, onCancel }) => {
  const [platforms, setPlatforms] = useState([]);
  const [platform, setPlatform] = useState(existingPost?.platform || '');
  const [contentText, setContentText] = useState(existingPost?.contentText || '');
  const [mediaUrl, setMediaUrl] = useState(existingPost?.mediaUrl || '');
  const [scheduledAt, setScheduledAt] = useState(existingPost?.scheduledAt ? existingPost.scheduledAt.substring(0, 16) : ''); // Format for datetime-local
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getSocialPlatforms().then(setPlatforms);
    if (existingPost) {
      setPlatform(existingPost.platform);
      setContentText(existingPost.contentText);
      setMediaUrl(existingPost.mediaUrl || '');
      setScheduledAt(existingPost.scheduledAt ? existingPost.scheduledAt.substring(0, 16) : '');
    }
  }, [existingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!platform || !contentText || !scheduledAt) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Plataforma, Conteúdo e Data de Agendamento são obrigatórios.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
    try {
      await onSave({ platform, contentText, mediaUrl, scheduledAt: new Date(scheduledAt).toISOString() });
      // Reset form or close modal would happen here, handled by parent
    } catch (error) {
      toast({
        title: 'Erro ao salvar post',
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
      <Heading size="md" mb={4}>{existingPost ? 'Editar Post' : 'Adicionar Novo Post Social'}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="platform">Plataforma</FormLabel>
            <Select 
              id="platform" 
              placeholder="Selecione a plataforma" 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
            >
              {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="contentText">Conteúdo</FormLabel>
            <Textarea 
              id="contentText" 
              value={contentText} 
              onChange={(e) => setContentText(e.target.value)} 
              placeholder="Escreva o conteúdo do seu post aqui..."
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="mediaUrl">URL da Mídia (opcional)</FormLabel>
            <Input 
              id="mediaUrl" 
              type="url" 
              value={mediaUrl} 
              onChange={(e) => setMediaUrl(e.target.value)} 
              placeholder="https://exemplo.com/imagem.png"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="scheduledAt">Data de Agendamento</FormLabel>
            <Input 
              id="scheduledAt" 
              type="datetime-local" 
              value={scheduledAt} 
              onChange={(e) => setScheduledAt(e.target.value)} 
            />
          </FormControl>
          <Text fontSize="xs" color="gray.500" mt={1}>Selecione uma data e hora para o post ser publicado.</Text>
          <Box>
            <Button type="submit" colorScheme="blue" isLoading={isLoading} mr={3}>
              {existingPost ? 'Salvar Alterações' : 'Adicionar Post'}
            </Button>
            {onCancel && <Button variant="ghost" onClick={onCancel}>Cancelar</Button>}
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default SocialPostForm;
