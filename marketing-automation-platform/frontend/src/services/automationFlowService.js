// Mocked automation flow service

const mockTriggerTypes = [
  { id: 'CLIENT_CREATED', name: 'Cliente Criado' },
  { id: 'CLIENT_TAG_ADDED', name: 'Tag Adicionada ao Cliente' },
  { id: 'CLIENT_BIRTHDAY', name: 'Aniversário do Cliente' },
  { id: 'CAMPAIGN_INTERACTION', name: 'Interação com Campanha' },
  { id: 'SPECIFIC_DATE', name: 'Data Específica' },
];

const mockActionTypes = [
  { id: 'SEND_EMAIL', name: 'Enviar E-mail' },
  { id: 'SCHEDULE_SOCIAL_POST', name: 'Agendar Post Social' },
  { id: 'UPDATE_CLIENT_TAGS', name: 'Atualizar Tags do Cliente' },
];

let mockAutomationFlows = [
  {
    id: 'flow1',
    name: 'Boas-vindas Novo Cliente',
    description: 'Envia um e-mail de boas-vindas quando um novo cliente é criado.',
    isActive: true,
    userId: 'user1', // Assuming a user context for potential future use
    triggers: [
      { id: 'trigger1_1', flowId: 'flow1', type: 'CLIENT_CREATED', config: { message: 'Quando qualquer novo cliente é adicionado.' } },
    ],
    actions: [
      { id: 'action1_1', flowId: 'flow1', type: 'SEND_EMAIL', config: { emailTemplateId: 'welcome_email_template', subject: 'Bem-vindo(a) à Nossa Plataforma!' }, order: 1, delayMinutes: 5 },
      { id: 'action1_2', flowId: 'flow1', type: 'UPDATE_CLIENT_TAGS', config: { addTags: ['onboarding_started'], removeTags: [] }, order: 2, delayMinutes: 0 },
    ],
  },
  {
    id: 'flow2',
    name: 'Lembrete de Aniversário',
    description: 'Envia um e-mail de feliz aniversário 3 dias antes.',
    isActive: false,
    userId: 'user1',
    triggers: [
      { id: 'trigger2_1', flowId: 'flow2', type: 'CLIENT_BIRTHDAY', config: { daysBefore: 3 } },
    ],
    actions: [
      { id: 'action2_1', flowId: 'flow2', type: 'SEND_EMAIL', config: { emailTemplateId: 'birthday_greeting_template', subject: 'Feliz Aniversário!' }, order: 1, delayMinutes: 0 },
    ],
  },
];

export const getAutomationFlows = async () => {
  console.log('[Mock API] Fetching automation flows');
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockAutomationFlows))), 300));
};

export const getAutomationFlowById = async (flowId) => {
  console.log(`[Mock API] Fetching automation flow with ID: ${flowId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const flow = mockAutomationFlows.find(f => f.id === flowId);
      if (flow) {
        resolve(JSON.parse(JSON.stringify(flow)));
      } else {
        reject(new Error(`Automation flow with ID ${flowId} not found.`));
      }
    }, 300);
  });
};

export const createAutomationFlow = async (data) => {
  console.log('[Mock API] Creating automation flow:', data);
  return new Promise(resolve => {
    setTimeout(() => {
      const newFlow = {
        id: `flow${Date.now()}`,
        ...data,
        isActive: data.isActive || false,
        triggers: [],
        actions: [],
        userId: 'user1', // Mock userId
      };
      mockAutomationFlows.push(newFlow);
      resolve(JSON.parse(JSON.stringify(newFlow)));
    }, 400);
  });
};

export const updateAutomationFlow = async (flowId, data) => {
  console.log(`[Mock API] Updating automation flow ${flowId}:`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAutomationFlows.findIndex(f => f.id === flowId);
      if (index !== -1) {
        mockAutomationFlows[index] = { ...mockAutomationFlows[index], ...data };
        resolve(JSON.parse(JSON.stringify(mockAutomationFlows[index])));
      } else {
        reject(new Error(`Automation flow with ID ${flowId} not found for update.`));
      }
    }, 400);
  });
};

export const removeAutomationFlow = async (flowId) => {
  console.log(`[Mock API] Removing automation flow ${flowId}`);
   return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAutomationFlows.findIndex(f => f.id === flowId);
      if (index !== -1) {
        const removed = mockAutomationFlows.splice(index, 1);
        resolve(JSON.parse(JSON.stringify(removed[0])));
      } else {
        reject(new Error(`Automation flow with ID ${flowId} not found for deletion.`));
      }
    }, 300);
  });
};


export const addTriggerToFlow = async (flowId, triggerData) => {
  console.log(`[Mock API] Adding trigger to flow ${flowId}:`, triggerData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const flow = mockAutomationFlows.find(f => f.id === flowId);
      if (flow) {
        const newTrigger = { id: `trigger${Date.now()}`, flowId, ...triggerData };
        flow.triggers.push(newTrigger);
        resolve(JSON.parse(JSON.stringify(newTrigger)));
      } else {
        reject(new Error(`Flow with ID ${flowId} not found.`));
      }
    }, 300);
  });
};

export const updateTrigger = async (triggerId, data) => {
    console.log(`[Mock API] Updating trigger ${triggerId}:`, data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const flow of mockAutomationFlows) {
                const index = flow.triggers.findIndex(t => t.id === triggerId);
                if (index !== -1) {
                    flow.triggers[index] = { ...flow.triggers[index], ...data };
                    resolve(JSON.parse(JSON.stringify(flow.triggers[index])));
                    return;
                }
            }
            reject(new Error(`Trigger with ID ${triggerId} not found.`));
        }, 300);
    });
};

export const removeTrigger = async (flowId, triggerId) => {
  console.log(`[Mock API] Removing trigger ${triggerId} from flow ${flowId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const flow = mockAutomationFlows.find(f => f.id === flowId);
      if (flow) {
        const index = flow.triggers.findIndex(t => t.id === triggerId);
        if (index !== -1) {
          const removed = flow.triggers.splice(index, 1);
          resolve(JSON.parse(JSON.stringify(removed[0])));
        } else {
          reject(new Error(`Trigger with ID ${triggerId} not found in flow ${flowId}.`));
        }
      } else {
        reject(new Error(`Flow with ID ${flowId} not found.`));
      }
    }, 300);
  });
};


export const addActionToFlow = async (flowId, actionData) => {
  console.log(`[Mock API] Adding action to flow ${flowId}:`, actionData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const flow = mockAutomationFlows.find(f => f.id === flowId);
      if (flow) {
        const newAction = { id: `action${Date.now()}`, flowId, ...actionData };
        flow.actions.push(newAction);
        // Re-sort actions by order
        flow.actions.sort((a, b) => a.order - b.order);
        resolve(JSON.parse(JSON.stringify(newAction)));
      } else {
        reject(new Error(`Flow with ID ${flowId} not found.`));
      }
    }, 300);
  });
};

export const updateAction = async (actionId, data) => {
    console.log(`[Mock API] Updating action ${actionId}:`, data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const flow of mockAutomationFlows) {
                const index = flow.actions.findIndex(a => a.id === actionId);
                if (index !== -1) {
                    flow.actions[index] = { ...flow.actions[index], ...data };
                     // Re-sort actions by order if order changed
                    if(data.order !== undefined) flow.actions.sort((a, b) => a.order - b.order);
                    resolve(JSON.parse(JSON.stringify(flow.actions[index])));
                    return;
                }
            }
            reject(new Error(`Action with ID ${actionId} not found.`));
        }, 300);
    });
};

export const removeAction = async (flowId, actionId) => {
  console.log(`[Mock API] Removing action ${actionId} from flow ${flowId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const flow = mockAutomationFlows.find(f => f.id === flowId);
      if (flow) {
        const index = flow.actions.findIndex(a => a.id === actionId);
        if (index !== -1) {
          const removed = flow.actions.splice(index, 1);
          resolve(JSON.parse(JSON.stringify(removed[0])));
        } else {
          reject(new Error(`Action with ID ${actionId} not found in flow ${flowId}.`));
        }
      } else {
        reject(new Error(`Flow with ID ${flowId} not found.`));
      }
    }, 300);
  });
};


export const getTriggerTypes = async () => {
  return Promise.resolve([...mockTriggerTypes]);
};

export const getActionTypes = async () => {
  return Promise.resolve([...mockActionTypes]);
};
