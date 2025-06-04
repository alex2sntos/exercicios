import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Stack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Spacer,
  Tag,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { getCampaignById, createCampaign, updateCampaign, addSocialPostToCampaign, addEmailToCampaign, getAvailableChannels } from '../../services/campaignService';
import SocialPostForm from '../../components/campaigns/SocialPostForm';
import EmailForm from '../../components/campaigns/EmailForm';

const CampaignCreationPage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = Boolean(campaignId);

  const [campaign, setCampaign] = useState({
    name: '',
    goal: '',
    channels: [],
    startDate: '',
    endDate: '',
    status: 'draft', // Default status
  });
  const [socialPosts, setSocialPosts] = useState([]);
  const [emails, setEmails] = useState([]);
  const [availableChannels, setAvailableChannels] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Modal states
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();
  const { isOpen: isEmailModalOpen, onOpen: onEmailModalOpen, onClose: onEmailModalClose } = useDisclosure();
  const [editingPost, setEditingPost] = useState(null);
  const [editingEmail, setEditingEmail] = useState(null);


  useEffect(() => {
    getAvailableChannels().then(setAvailableChannels);
    if (isEditing && campaignId) {
      setLoading(true);
      getCampaignById(campaignId)
        .then(data => {
          setCampaign({
            name: data.name || '',
            goal: data.goal || '',
            channels: data.channels || [],
            startDate: data.startDate ? data.startDate.split('T')[0] : '',
            endDate: data.endDate ? data.endDate.split('T')[0] : '',
            status: data.status || 'draft',
          });
          setSocialPosts(data.socialPosts || []);
          setEmails(data.emails || []);
        })
        .catch(err => {
          toast({ title: 'Erro ao carregar campanha', description: err.message, status: 'error', duration: 5000 });
          navigate('/'); // Redirect if campaign not found or error
        })
        .finally(() => setLoading(false));
    }
  }, [campaignId, isEditing, toast, navigate]);

  const handleCampaignChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleChannelChange = (selectedChannels) => {
    setCampaign(prev => ({ ...prev, channels: selectedChannels }));
  };

  const handleSave = async (newStatus) => {
    setLoading(true);
    setFormError(null);
    if (!campaign.name) {
        toast({ title: "Nome da campanha é obrigatório.", status: 'error', duration: 3000});
        setLoading(false);
        return;
    }
    const campaignData = { ...campaign, status: newStatus || campaign.status };

    try {
      let savedCampaign;
      if (isEditing) {
        savedCampaign = await updateCampaign(campaignId, campaignData);
      } else {
        savedCampaign = await createCampaign(campaignData);
        if (!isEditing && savedCampaign.id) {
            // Important: after creation, switch to edit mode for this new campaign
            // This allows adding posts/emails which require a campaignId
            navigate(`/campaigns/${savedCampaign.id}/edit`, { replace: true }); 
        }
      }
      toast({ title: `Campanha ${isEditing ? 'atualizada' : 'criada'} com sucesso!`, status: 'success', duration: 3000 });
      // Social posts and emails are saved separately after campaign is created/updated
    } catch (err) {
      toast({ title: 'Erro ao salvar campanha', description: err.message, status: 'error', duration: 5000 });
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Social Post Handlers
  const handleAddOrEditPost = (post) => {
    setEditingPost(post); // If post is null, it's an "add new"
    onPostModalOpen();
  };

  const handleSaveSocialPost = async (postData) => {
    if (!campaignId && !isEditing && !campaign.id) { // Check if main campaign has an ID
        toast({ title: "Salve a campanha principal primeiro", description: "Você precisa salvar a campanha antes de adicionar posts.", status: "warning"});
        return;
    }
    const currentCampaignId = campaignId || campaign.id; // Use existing ID or newly created one
    
    try {
        // For simplicity, we're not handling editing existing posts in this mock service for now
        // It would require a separate updateSocialPost function in service
        const newPost = await addSocialPostToCampaign(currentCampaignId, postData);
        setSocialPosts(prev => [...prev, newPost]); // Add to local state
        toast({ title: 'Post social salvo!', status: 'success', duration: 2000 });
        onPostModalClose();
    } catch (error) {
        toast({ title: 'Erro ao salvar post social', description: error.message, status: 'error' });
    }
  };

  // Email Handlers (similar to Social Post)
  const handleAddOrEditEmail = (email) => {
    setEditingEmail(email);
    onEmailModalOpen();
  };

  const handleSaveEmail = async (emailData) => {
     if (!campaignId && !isEditing && !campaign.id) {
        toast({ title: "Salve a campanha principal primeiro", description: "Você precisa salvar a campanha antes de adicionar e-mails.", status: "warning"});
        return;
    }
    const currentCampaignId = campaignId || campaign.id;
    try {
        const newEmail = await addEmailToCampaign(currentCampaignId, emailData);
        setEmails(prev => [...prev, newEmail]);
        toast({ title: 'E-mail salvo!', status: 'success', duration: 2000 });
        onEmailModalClose();
    } catch (error) {
        toast({ title: 'Erro ao salvar e-mail', description: error.message, status: 'error' });
    }
  };


  if (isEditing && loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="200px"><Spinner size="xl" /></Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={6}>{isEditing ? `Editar Campanha: ${campaign.name || ''}` : 'Criar Nova Campanha'}</Heading>
      
      {formError && <Alert status="error" mb={4}><AlertIcon />{formError}</Alert>}

      <VStack spacing={6} align="stretch">
        {/* Campaign Details Form */}
        <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md">
          <Heading size="lg" mb={4}>Detalhes da Campanha</Heading>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="name">Nome da Campanha</FormLabel>
            <Input id="name" name="name" value={campaign.name} onChange={handleCampaignChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="goal">Objetivo</FormLabel>
            <Textarea id="goal" name="goal" value={campaign.goal} onChange={handleCampaignChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Canais</FormLabel>
            <CheckboxGroup colorScheme="blue" value={campaign.channels} onChange={handleChannelChange}>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={5}>
                {availableChannels.map(channel => (
                  <Checkbox key={channel.id} value={channel.id}>{channel.name}</Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
          <HStack spacing={4} mb={4}>
            <FormControl>
              <FormLabel htmlFor="startDate">Data de Início</FormLabel>
              <Input id="startDate" name="startDate" type="date" value={campaign.startDate} onChange={handleCampaignChange} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="endDate">Data de Término</FormLabel>
              <Input id="endDate" name="endDate" type="date" value={campaign.endDate} onChange={handleCampaignChange} />
            </FormControl>
          </HStack>
        </Box>

        {/* Content Management Tabs */}
        <Box borderWidth="1px" borderRadius="lg" shadow="md">
          <Tabs isFitted variant="enclosed-colored" colorScheme="blue">
            <TabList mb="1em">
              <Tab>Posts de Redes Sociais ({socialPosts.length})</Tab>
              <Tab>E-mails ({emails.length})</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Button leftIcon={<FiPlusCircle />} colorScheme="teal" onClick={() => handleAddOrEditPost(null)} isDisabled={!isEditing && !campaignId}>
                    Adicionar Novo Post Social
                  </Button>
                  <Text fontSize="sm" color="gray.500">Templates: Seleção de templates aparecerá aqui.</Text>
                  {socialPosts.map(post => (
                    <Flex key={post.id} p={3} borderWidth="1px" borderRadius="md" alignItems="center">
                      <Box flex="1">
                        <Text fontWeight="bold">{post.platform}</Text>
                        <Text isTruncated maxWidth="300px">{post.contentText}</Text>
                        <Text fontSize="xs">Agendado para: {new Date(post.scheduledAt).toLocaleString()}</Text>
                      </Box>
                      <Spacer />
                      {/* <IconButton icon={<FiEdit2 />} aria-label="Editar Post" variant="ghost" onClick={() => handleAddOrEditPost(post)} isDisabled={true} />
                      <IconButton icon={<FiTrash2 />} aria-label="Remover Post" variant="ghost" colorScheme="red" isDisabled={true} /> */}
                       <Tag size="sm" colorScheme={post.status === 'posted' ? 'green' : 'blue' }>{post.status || 'Agendado'}</Tag>
                    </Flex>
                  ))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Button leftIcon={<FiPlusCircle />} colorScheme="purple" onClick={() => handleAddOrEditEmail(null)} isDisabled={!isEditing && !campaignId}>
                    Adicionar Novo E-mail
                  </Button>
                   <Text fontSize="sm" color="gray.500">Templates: Seleção de templates aparecerá aqui.</Text>
                  {emails.map(email => (
                     <Flex key={email.id} p={3} borderWidth="1px" borderRadius="md" alignItems="center">
                      <Box flex="1">
                        <Text fontWeight="bold">{email.subject}</Text>
                        <Text>Para: {email.recipientEmail}</Text>
                         <Text fontSize="xs">Agendado para: {new Date(email.scheduledAt).toLocaleString()}</Text>
                      </Box>
                      <Spacer />
                      {/* <IconButton icon={<FiEdit2 />} aria-label="Editar Email" variant="ghost" onClick={() => handleAddOrEditEmail(email)} isDisabled={true} />
                      <IconButton icon={<FiTrash2 />} aria-label="Remover Email" variant="ghost" colorScheme="red" isDisabled={true} /> */}
                      <Tag size="sm" colorScheme={email.status === 'sent' ? 'green' : 'blue' }>{email.status || 'Pendente'}</Tag>
                    </Flex>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <HStack justifyContent="flex-end" spacing={4} mt={6}>
          <Button variant="outline" onClick={() => navigate('/')}>Cancelar</Button>
          <Button colorScheme="gray" onClick={() => handleSave('draft')} isLoading={loading} isDisabled={!campaign.name}>
            Salvar Rascunho
          </Button>
          <Button colorScheme="blue" onClick={() => handleSave('active')} isLoading={loading} isDisabled={!campaign.name}>
            {isEditing ? 'Salvar e Lançar Alterações' : 'Salvar e Lançar Campanha'}
          </Button>
        </HStack>
      </VStack>

      {/* Modal for SocialPostForm */}
      <Modal isOpen={isPostModalOpen} onClose={onPostModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingPost ? 'Editar Post Social' : 'Adicionar Novo Post Social'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SocialPostForm 
              campaignId={campaignId || campaign.id} 
              existingPost={editingPost} 
              onSave={handleSaveSocialPost}
              onCancel={onPostModalClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal for EmailForm */}
      <Modal isOpen={isEmailModalOpen} onClose={onEmailModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingEmail ? 'Editar E-mail' : 'Adicionar Novo E-mail'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EmailForm 
              campaignId={campaignId || campaign.id}
              existingEmail={editingEmail}
              onSave={handleSaveEmail}
              onCancel={onEmailModalClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default CampaignCreationPage;
