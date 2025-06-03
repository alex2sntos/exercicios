import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, VStack, FormControl,
  FormLabel, Input, Button, useToast, Spinner, Alert, AlertIcon, SimpleGrid, Select
} from '@chakra-ui/react';
import * as API from '../services/settingsService';
import IntegrationCard from '../components/settings/IntegrationCard';

const SettingsPage = () => {
  const [profile, setProfile] = useState({ businessName: '', businessType: '', phoneNumber: '', email: '' });
  const [initialProfile, setInitialProfile] = useState({}); // To compare for changes
  const [integrationStatuses, setIntegrationStatuses] = useState({});
  const [apiKeys, setApiKeys] = useState({}); // Holds all API keys e.g. { sendgrid: "key", mailchimp: "key" }
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(true);
  const [isSavingKeys, setIsSavingKeys] = useState({}); // e.g. { sendgrid: true } when saving sendgrid keys

  const [businessTypes, setBusinessTypes] = useState([]);

  const toast = useToast();

  const fetchSettingsData = useCallback(async () => {
    setIsLoadingProfile(true);
    setIsLoadingIntegrations(true);
    try {
      const [profileData, statusesData, keysData, bTypes] = await Promise.all([
        API.getUserProfile(),
        API.getIntegrationStatuses(),
        API.getApiKeys(),
        API.getBusinessTypes(),
      ]);
      setProfile(profileData);
      setInitialProfile(profileData); // Store initial state
      setIntegrationStatuses(statusesData);
      setApiKeys(keysData);
      setBusinessTypes(bTypes);
    } catch (error) {
      toast({ title: 'Erro ao carregar configurações', description: error.message, status: 'error' });
    } finally {
      setIsLoadingProfile(false);
      setIsLoadingIntegrations(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const updatedProfile = await API.updateUserProfile(profile);
      setProfile(updatedProfile);
      setInitialProfile(updatedProfile); // Update initial state after save
      toast({ title: 'Perfil atualizado com sucesso!', status: 'success' });
    } catch (error) {
      toast({ title: 'Erro ao atualizar perfil', description: error.message, status: 'error' });
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const isProfileChanged = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const handleIntegrationConnect = async (serviceName) => {
    try {
      // For OAuth, this would redirect. For API keys, it might trigger a validation or just UI change.
      const result = await API.connectIntegration(serviceName);
      if (result.success) {
        setIntegrationStatuses(prev => ({ ...prev, [serviceName]: true }));
        toast({ title: result.message || `${serviceName} conectado!`, status: 'success' });
      } else {
        toast({ title: result.message || `Falha ao conectar ${serviceName}`, status: 'error' });
      }
    } catch (error) {
      toast({ title: `Erro ao conectar ${serviceName}`, description: error.message, status: 'error' });
    }
  };

  const handleIntegrationDisconnect = async (serviceName) => {
    try {
      const result = await API.disconnectIntegration(serviceName);
       if (result.success) {
        setIntegrationStatuses(prev => ({ ...prev, [serviceName]: false }));
        // Clear relevant API keys from local state if they were part of the disconnect logic
        if (serviceName === 'sendgrid') setApiKeys(prev => ({...prev, sendgrid: ''}));
        if (serviceName === 'mailchimp') setApiKeys(prev => ({...prev, mailchimp: ''}));
        if (serviceName === 'twilio_whatsapp') setApiKeys(prev => ({...prev, twilio_whatsapp_sid: '', twilio_whatsapp_token: ''}));
        toast({ title: result.message || `${serviceName} desconectado!`, status: 'info' });
      } else {
        toast({ title: result.message || `Falha ao desconectar ${serviceName}`, status: 'error' });
      }
    } catch (error) {
      toast({ title: `Erro ao desconectar ${serviceName}`, description: error.message, status: 'error' });
    }
  };

  const handleSaveApiKeysForService = async (serviceName, keysToSave) => {
    setIsSavingKeys(prev => ({...prev, [serviceName]: true}));
    try {
      const result = await API.saveApiKeys(serviceName, keysToSave);
      if (result.success) {
        setApiKeys(prev => ({ ...prev, ...keysToSave })); // Update local state with saved keys
        // Update connection status based on result (service might connect on successful key save)
        const newStatuses = await API.getIntegrationStatuses(); // Re-fetch statuses as saveApiKeys might change them
        setIntegrationStatuses(newStatuses);
        toast({ title: result.message || `Chaves para ${serviceName} salvas!`, status: 'success' });
      } else {
         toast({ title: result.message || `Erro ao salvar chaves para ${serviceName}`, status: 'error' });
      }
    } catch (error) {
      toast({ title: `Erro ao salvar chaves para ${serviceName}`, description: error.message, status: 'error' });
    } finally {
        setIsSavingKeys(prev => ({...prev, [serviceName]: false}));
    }
  };


  if (isLoadingProfile || isLoadingIntegrations) {
    return <Box display="flex" justifyContent="center" my={10}><Spinner size="xl" /></Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Configurações</Heading>
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb="1em">
          <Tab>Perfil do Negócio</Tab>
          <Tab>Integrações</Tab>
        </TabList>
        <TabPanels>
          {/* Perfil do Negócio Panel */}
          <TabPanel>
            <VStack as="form" spacing={4} align="stretch" maxW="lg" onSubmit={(e) => { e.preventDefault(); handleSaveProfile();}}>
              <FormControl isRequired>
                <FormLabel htmlFor="businessName">Nome do Negócio</FormLabel>
                <Input id="businessName" name="businessName" value={profile.businessName} onChange={handleProfileChange} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="businessType">Tipo do Negócio</FormLabel>
                <Select 
                    id="businessType" 
                    name="businessType" 
                    value={profile.businessType} 
                    onChange={handleProfileChange}
                    placeholder="Selecione um tipo"
                >
                    {businessTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.name}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="phoneNumber">Telefone (WhatsApp)</FormLabel>
                <Input id="phoneNumber" name="phoneNumber" type="tel" value={profile.phoneNumber} onChange={handleProfileChange} placeholder="Usado para relatórios via WhatsApp" />
              </FormControl>
              <FormControl isReadOnly>
                <FormLabel htmlFor="email">E-mail de Login</FormLabel>
                <Input id="email" name="email" type="email" value={profile.email} isDisabled />
              </FormControl>
              <Button 
                type="submit" 
                colorScheme="blue" 
                isLoading={isSavingProfile} 
                isDisabled={!isProfileChanged}
                alignSelf="flex-start"
              >
                Salvar Perfil
              </Button>
            </VStack>
          </TabPanel>

          {/* Integrações Panel */}
          <TabPanel>
            <Heading size="lg" mb={4}>Gerenciar Integrações</Heading>
            {isLoadingIntegrations ? <Spinner /> : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <IntegrationCard
                serviceName="Facebook"
                description="Conecte sua página do Facebook para gerenciar posts e campanhas."
                isConnected={integrationStatuses.facebook}
                onConnect={() => handleIntegrationConnect('facebook')}
                onDisconnect={() => handleIntegrationDisconnect('facebook')}
                officialPageUrl="https://www.facebook.com/business"
                helpText="Requer autenticação OAuth."
              />
              <IntegrationCard
                serviceName="Instagram Business"
                description="Conecte sua conta comercial do Instagram para posts e stories."
                isConnected={integrationStatuses.instagram}
                onConnect={() => handleIntegrationConnect('instagram')}
                onDisconnect={() => handleIntegrationDisconnect('instagram')}
                officialPageUrl="https://business.instagram.com/"
                helpText="Requer uma conta do Facebook vinculada."
              />
              <IntegrationCard
                serviceName="Gmail"
                description="Autorize o envio de e-mails através da sua conta Gmail."
                isConnected={integrationStatuses.gmail}
                onConnect={() => handleIntegrationConnect('gmail')}
                onDisconnect={() => handleIntegrationDisconnect('gmail')}
                officialPageUrl="https://mail.google.com/"
                helpText="Requer autenticação OAuth."
              />
              <IntegrationCard
                serviceName="SendGrid"
                description="Use SendGrid para envio de e-mails transacionais em massa."
                isConnected={integrationStatuses.sendgrid}
                onSaveKeys={(keys) => handleSaveApiKeysForService('sendgrid', {apiKey: keys.sendgrid_api_key})}
                isSavingKeys={isSavingKeys.sendgrid}
                apiKeyFields={[{ id: 'sendgrid_api_key', label: 'SendGrid API Key', value: apiKeys.sendgrid }]}
                onDisconnect={() => handleIntegrationDisconnect('sendgrid')}
                officialPageUrl="https://sendgrid.com/"
              />
              <IntegrationCard
                serviceName="Mailchimp"
                description="Conecte Mailchimp para sincronizar listas e enviar campanhas de e-mail."
                isConnected={integrationStatuses.mailchimp}
                onSaveKeys={(keys) => handleSaveApiKeysForService('mailchimp', {apiKey: keys.mailchimp_api_key})}
                isSavingKeys={isSavingKeys.mailchimp}
                apiKeyFields={[{ id: 'mailchimp_api_key', label: 'Mailchimp API Key', value: apiKeys.mailchimp }]}
                onDisconnect={() => handleIntegrationDisconnect('mailchimp')}
                officialPageUrl="https://mailchimp.com/"
              />
              <IntegrationCard
                serviceName="Twilio (WhatsApp)"
                description="Envie notificações e relatórios via WhatsApp usando Twilio."
                isConnected={integrationStatuses.twilio_whatsapp}
                onSaveKeys={(keys) => handleSaveApiKeysForService('twilio_whatsapp', {accountSid: keys.twilio_sid, authToken: keys.twilio_token, fromNumber: keys.twilio_from})}
                isSavingKeys={isSavingKeys.twilio_whatsapp}
                apiKeyFields={[
                    { id: 'twilio_sid', label: 'Twilio Account SID', value: apiKeys.twilio_whatsapp_sid },
                    { id: 'twilio_token', label: 'Twilio Auth Token', value: apiKeys.twilio_whatsapp_token, type: 'password' },
                    { id: 'twilio_from', label: 'Twilio WhatsApp From Number', value: apiKeys.twilio_whatsapp_from, type: 'tel' },
                ]}
                onDisconnect={() => handleIntegrationDisconnect('twilio_whatsapp')}
                officialPageUrl="https://www.twilio.com/whatsapp"
              />
            </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SettingsPage;
