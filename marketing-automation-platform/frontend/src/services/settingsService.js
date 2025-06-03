// Mocked settings service

let mockUserProfile = {
  businessName: 'Minha Loja Incrível',
  businessType: 'ecommerce',
  phoneNumber: '11987654321', // For WhatsApp reports
  email: 'usuario@example.com', // Login email, usually readonly
};

let mockIntegrationStatuses = {
  facebook: false,
  instagram: false,
  gmail: false,
  sendgrid: true, // Example: already "connected" / API key saved
  mailchimp: false,
  twilio_whatsapp: true,
};

// Store API keys locally in this mock service for simulation
let mockApiKeys = {
    sendgrid: 'SG.xxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    mailchimp: '',
    twilio_whatsapp_sid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    twilio_whatsapp_token: 'your_twilio_auth_token_mock',
    twilio_whatsapp_from: 'whatsapp:+14155238886',
};


export const getUserProfile = async () => {
  console.log('[Mock API] Fetching user profile');
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockUserProfile))), 300));
};

export const updateUserProfile = async (profileData) => {
  console.log('[Mock API] Updating user profile:', profileData);
  return new Promise(resolve => {
    setTimeout(() => {
      mockUserProfile = { ...mockUserProfile, ...profileData, email: mockUserProfile.email }; // Ensure email remains readonly
      resolve(JSON.parse(JSON.stringify(mockUserProfile)));
    }, 500);
  });
};

export const getIntegrationStatuses = async () => {
  console.log('[Mock API] Fetching integration statuses');
  return new Promise(resolve => setTimeout(() => resolve({ ...mockIntegrationStatuses }), 200));
};

export const getApiKeys = async () => {
    console.log('[Mock API] Fetching API Keys');
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockApiKeys))), 100));
};

export const connectIntegration = async (serviceName) => {
  console.log(`[Mock API] Connecting integration: ${serviceName}`);
  return new Promise(resolve => {
    setTimeout(() => {
      if (mockIntegrationStatuses.hasOwnProperty(serviceName)) {
        // For OAuth services, this would involve a popup and redirect flow.
        // For API key services, it might mean the key is valid.
        mockIntegrationStatuses[serviceName] = true;
        resolve({ success: true, serviceName, status: true, message: `${serviceName} conectado com sucesso (simulado).` });
      } else {
        resolve({ success: false, serviceName, status: false, message: `Serviço ${serviceName} desconhecido.` });
      }
    }, 700);
  });
};

export const disconnectIntegration = async (serviceName) => {
  console.log(`[Mock API] Disconnecting integration: ${serviceName}`);
  return new Promise(resolve => {
    setTimeout(() => {
      if (mockIntegrationStatuses.hasOwnProperty(serviceName)) {
        mockIntegrationStatuses[serviceName] = false;
        // Also clear related API keys if any for this service
        if (serviceName === 'sendgrid') mockApiKeys.sendgrid = '';
        if (serviceName === 'mailchimp') mockApiKeys.mailchimp = '';
        if (serviceName === 'twilio_whatsapp') {
            mockApiKeys.twilio_whatsapp_sid = '';
            mockApiKeys.twilio_whatsapp_token = '';
            // mockApiKeys.twilio_whatsapp_from = ''; // Usually from number doesn't change like this
        }
        resolve({ success: true, serviceName, status: false, message: `${serviceName} desconectado (simulado).` });
      } else {
        resolve({ success: false, serviceName, status: false, message: `Serviço ${serviceName} desconhecido.` });
      }
    }, 500);
  });
};

export const saveApiKeys = async (serviceName, keys) => {
  // keys is an object like { apiKey: 'value' } or { sid: 'value1', token: 'value2' }
  console.log(`[Mock API] Saving API keys for ${serviceName}:`, keys);
  return new Promise(resolve => {
    setTimeout(() => {
      let allKeysPresent = true;
      if (serviceName === 'sendgrid') {
        mockApiKeys.sendgrid = keys.apiKey || '';
        if (!keys.apiKey) allKeysPresent = false;
      } else if (serviceName === 'mailchimp') {
        mockApiKeys.mailchimp = keys.apiKey || '';
         if (!keys.apiKey) allKeysPresent = false;
      } else if (serviceName === 'twilio_whatsapp') {
        mockApiKeys.twilio_whatsapp_sid = keys.accountSid || '';
        mockApiKeys.twilio_whatsapp_token = keys.authToken || '';
        if (keys.fromNumber) mockApiKeys.twilio_whatsapp_from = keys.fromNumber; // Allow updating from number too
         if (!keys.accountSid || !keys.authToken) allKeysPresent = false;
      } else {
        return resolve({ success: false, message: `Serviço ${serviceName} não suporta salvamento de chave de API desta forma.` });
      }
      
      // Simulate connection status based on API key presence
      if (allKeysPresent && mockIntegrationStatuses.hasOwnProperty(serviceName)) {
        mockIntegrationStatuses[serviceName] = true;
      } else if (!allKeysPresent && mockIntegrationStatuses.hasOwnProperty(serviceName)) {
         mockIntegrationStatuses[serviceName] = false; // Disconnect if keys are cleared
      }

      resolve({ success: true, message: `Chaves de API para ${serviceName} salvas (simulado). Status de conexão atualizado.` });
    }, 600);
  });
};

export const getBusinessTypes = async () => {
    return Promise.resolve([
        {id: 'ecommerce', name: 'E-commerce'},
        {id: 'restaurant', name: 'Restaurante'},
        {id: 'beauty_salon', name: 'Salão de Beleza'},
        {id: 'real_estate', name: 'Imobiliária'},
        {id: 'consulting', name: 'Consultoria'},
        {id: 'education', name: 'Educação'},
        {id: 'other', name: 'Outro'},
    ]);
};
