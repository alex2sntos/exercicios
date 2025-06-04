// Mocked campaign service

const mockCampaigns = [
  {
    id: 'campaign1',
    name: 'Promoção de Verão',
    goal: 'Aumentar as vendas de sorvetes em 20%',
    channels: ['email', 'instagram'],
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    status: 'active',
    socialPosts: [
      { id: 'post1', platform: 'instagram', contentText: 'Sol e sorvete! #verao', mediaUrl: 'https://via.placeholder.com/300.png?text=Post+Instagram+1', scheduledAt: '2024-07-05T10:00:00' },
      { id: 'post2', platform: 'facebook', contentText: 'Refresque seu verão com nossos sabores!', scheduledAt: '2024-07-06T14:00:00' },
    ],
    emails: [
      { id: 'email1', subject: 'Descontos de Verão Chegaram!', body: '<p>Não perca nossos descontos especiais de verão!</p>', recipientEmail: 'todos@example.com', scheduledAt: '2024-07-03T09:00:00' },
    ],
  },
  {
    id: 'campaign2',
    name: 'Volta às Aulas',
    goal: 'Promover material escolar',
    channels: ['email', 'whatsapp'],
    startDate: '2024-08-15',
    endDate: '2024-09-05',
    status: 'draft',
    socialPosts: [],
    emails: [],
  },
];

export const getCampaignById = async (campaignId) => {
  console.log(`[Mock API] Fetching campaign with ID: ${campaignId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campaign = mockCampaigns.find(c => c.id === campaignId);
      if (campaign) {
        resolve(JSON.parse(JSON.stringify(campaign))); // Deep copy
      } else {
        reject(new Error(`Campaign with ID ${campaignId} not found.`));
      }
    }, 500);
  });
};

export const createCampaign = async (campaignData) => {
  console.log('[Mock API] Creating campaign:', campaignData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCampaign = {
        id: `campaign${Date.now()}`,
        ...campaignData,
        socialPosts: [],
        emails: [],
        status: campaignData.status || 'draft',
      };
      mockCampaigns.push(newCampaign);
      resolve(JSON.parse(JSON.stringify(newCampaign)));
    }, 500);
  });
};

export const updateCampaign = async (campaignId, campaignData) => {
  console.log(`[Mock API] Updating campaign ${campaignId}:`, campaignData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCampaigns.findIndex(c => c.id === campaignId);
      if (index !== -1) {
        mockCampaigns[index] = { ...mockCampaigns[index], ...campaignData };
        resolve(JSON.parse(JSON.stringify(mockCampaigns[index])));
      } else {
        reject(new Error(`Campaign with ID ${campaignId} not found during update.`));
      }
    }, 500);
  });
};

export const addSocialPostToCampaign = async (campaignId, postData) => {
  console.log(`[Mock API] Adding social post to campaign ${campaignId}:`, postData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campaign = mockCampaigns.find(c => c.id === campaignId);
      if (campaign) {
        const newPost = { id: `post${Date.now()}`, ...postData };
        campaign.socialPosts.push(newPost);
        resolve(JSON.parse(JSON.stringify(newPost)));
      } else {
        reject(new Error(`Campaign with ID ${campaignId} not found when adding post.`));
      }
    }, 300);
  });
};

export const addEmailToCampaign = async (campaignId, emailData) => {
  console.log(`[Mock API] Adding email to campaign ${campaignId}:`, emailData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campaign = mockCampaigns.find(c => c.id === campaignId);
      if (campaign) {
        const newEmail = { id: `email${Date.now()}`, ...emailData };
        campaign.emails.push(newEmail);
        resolve(JSON.parse(JSON.stringify(newEmail)));
      } else {
        reject(new Error(`Campaign with ID ${campaignId} not found when adding email.`));
      }
    }, 300);
  });
};

// Mock function to get available channels (could be from a config endpoint in real app)
export const getAvailableChannels = async () => {
  return Promise.resolve([
    { id: 'email', name: 'E-mail' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'whatsapp', name: 'WhatsApp Business' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'sms', name: 'SMS' },
  ]);
};

export const getSocialPlatforms = async () => {
    return Promise.resolve([
        { id: 'facebook', name: 'Facebook' },
        { id: 'instagram', name: 'Instagram' },
        { id: 'linkedin', name: 'LinkedIn' },
        { id: 'twitter', name: 'Twitter (X)' },
        // { id: 'whatsapp', name: 'WhatsApp' }, // WhatsApp usually via Business API, different flow
    ]);
};
