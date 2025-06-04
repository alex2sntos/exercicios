import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Icon,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { FiCheckCircle, FiXCircle, FiExternalLink, FiKey, FiSave } from 'react-icons/fi';

const IntegrationCard = ({
  serviceName,
  description,
  isConnected,
  onConnect,
  onDisconnect,
  onSaveKeys, // Callback to save API keys
  apiKeyFields = [], // Array of { id, label, value (initial), type (e.g. 'text' or 'password') }
  isSavingKeys, // boolean to show spinner on save button
  helpText,
  officialPageUrl,
}) => {
  const toast = useToast();
  // Initialize local state for API key fields
  const initialKeyValues = apiKeyFields.reduce((acc, field) => {
    acc[field.id] = field.value || '';
    return acc;
  }, {});
  const [localApiKeys, setLocalApiKeys] = useState(initialKeyValues);
  const [showInputs, setShowInputs] = useState(false); // To toggle API key inputs for connected services

  useEffect(() => {
    // Update local state if parent's initial values change (e.g., after fetching from backend)
    setLocalApiKeys(apiKeyFields.reduce((acc, field) => {
        acc[field.id] = field.value || '';
        return acc;
      }, {}));
  }, [apiKeyFields]);


  const handleApiKeyChange = (id, value) => {
    setLocalApiKeys(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveApiKeys = async () => {
    if (onSaveKeys) {
      await onSaveKeys(localApiKeys); // Pass the object of keys
    }
  };
  
  const isApiKeyService = apiKeyFields.length > 0;

  const handleToggleConnection = () => {
    if (isConnected) {
        if (onDisconnect) onDisconnect();
    } else {
        if (isApiKeyService) {
            // For API key services, "Connect" might just mean "Save Keys" if keys are present,
            // or it could reveal the input fields if they are hidden.
            // If keys are already present and valid, it might just be a visual toggle.
            // For this simulation, if keys are present, we save them. If not, we show inputs.
            if(Object.values(localApiKeys).some(key => key)) { // If any key has a value
                handleSaveApiKeys();
            } else {
                 setShowInputs(true); // Show inputs if they are hidden and no keys are set
            }
        } else {
            // For OAuth services
            if (onConnect) onConnect();
        }
    }
  };


  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%">
      <VStack align="start" spacing={3}>
        <HStack justifyContent="space-between" width="100%">
          <Heading size="md">{serviceName}</Heading>
          <Badge colorScheme={isConnected ? 'green' : 'red'} fontSize="0.9em" px={2} py={1}>
            <Icon as={isConnected ? FiCheckCircle : FiXCircle} mr={1} />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.600">{description}</Text>
        {helpText && <Text fontSize="xs" color="gray.500" fontStyle="italic">{helpText}</Text>}
        {officialPageUrl && (
            <Button 
                size="xs" 
                variant="link" 
                colorScheme="blue" 
                rightIcon={<FiExternalLink />}
                onClick={() => window.open(officialPageUrl, '_blank')}
            >
                Visitar página oficial
            </Button>
        )}

        {isApiKeyService && (isConnected || showInputs) && (
          <VStack spacing={4} align="stretch" width="100%" pt={3}>
            {apiKeyFields.map(field => (
              <FormControl key={field.id}>
                <FormLabel htmlFor={field.id} fontSize="sm">{field.label}</FormLabel>
                <Input
                  id={field.id}
                  type={field.type || 'text'}
                  value={localApiKeys[field.id] || ''}
                  onChange={(e) => handleApiKeyChange(field.id, e.target.value)}
                  placeholder={`Insira sua ${field.label}`}
                  size="sm"
                />
              </FormControl>
            ))}
            <Button 
                leftIcon={<FiSave />} 
                colorScheme="blue" 
                size="sm" 
                onClick={handleSaveApiKeys}
                isLoading={isSavingKeys}
                isDisabled={!Object.values(localApiKeys).some(key => key)} // Disable if all keys are empty
            >
              Salvar Chaves
            </Button>
          </VStack>
        )}

        <HStack width="100%" spacing={3} pt={2}>
          <Button
            colorScheme={isConnected ? 'red' : 'green'}
            onClick={handleToggleConnection}
            isLoading={isSavingKeys && !isConnected && isApiKeyService} // Show loading on connect if saving keys
            size="sm"
            leftIcon={isApiKeyService && !isConnected && !showInputs ? <FiKey /> : null}
          >
            {isConnected ? 'Desconectar' : (isApiKeyService ? (showInputs || Object.values(localApiKeys).some(key => key) ? 'Salvar e Conectar' : 'Configurar Chaves') : 'Conectar')}
          </Button>
           {isApiKeyService && isConnected && !showInputs && (
             <Button size="sm" variant="outline" onClick={() => setShowInputs(true)}>Mostrar Chaves</Button>
           )}
           {isApiKeyService && showInputs && (
             <Button size="sm" variant="outline" onClick={() => setShowInputs(false)}>Ocultar Chaves</Button>
           )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default IntegrationCard;
