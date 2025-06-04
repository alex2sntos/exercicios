// Mocked client service

const mockClients = [
  { id: 'client1', name: 'João Silva', email: 'joao.silva@example.com', phone: '11999998888', status: 'active', tags: ['vip', 'newsletter'] },
  { id: 'client2', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', phone: '21988887777', status: 'active', tags: ['new_lead'] },
  { id: 'client3', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', phone: '31977776666', status: 'inactive', tags: ['old_customer'] },
  { id: 'client4', name: 'Ana Costa', email: 'ana.costa@example.com', phone: '41966665555', status: 'new', tags: [] },
  { id: 'client5', name: 'Pedro Martins', email: 'pedro.martins@example.com', phone: '51955554444', status: 'active', tags: ['priority_support', 'newsletter'] },
  { id: 'client6', name: 'Luiza Almeida', email: 'luiza.almeida@example.com', phone: '61944443333', status: 'inactive', tags: [] },
];

const allTags = ['vip', 'newsletter', 'new_lead', 'old_customer', 'priority_support', 'interested_in_product_x'];
const allStatuses = [
    { id: 'active', name: 'Ativo' }, 
    { id: 'inactive', name: 'Inativo' }, 
    { id: 'new', name: 'Novo' },
    { id: 'archived', name: 'Arquivado'}
];


export const getClients = async (filters = {}) => {
  console.log('[Mock API] Fetching clients with filters:', filters);
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredClients = [...mockClients];
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredClients = filteredClients.filter(
          client => client.name.toLowerCase().includes(term) || client.email.toLowerCase().includes(term)
        );
      }
      if (filters.status) {
        filteredClients = filteredClients.filter(client => client.status === filters.status);
      }
      if (filters.tag) {
        filteredClients = filteredClients.filter(client => client.tags.includes(filters.tag));
      }
      resolve(JSON.parse(JSON.stringify(filteredClients))); // Deep copy
    }, 500);
  });
};

export const getClientById = async (clientId) => {
  console.log(`[Mock API] Fetching client with ID: ${clientId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const client = mockClients.find(c => c.id === clientId);
      if (client) {
        resolve(JSON.parse(JSON.stringify(client)));
      } else {
        reject(new Error(`Client with ID ${clientId} not found.`));
      }
    }, 300);
  });
};

export const createClient = async (clientData) => {
  console.log('[Mock API] Creating client:', clientData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClient = {
        id: `client${Date.now()}`,
        ...clientData,
        tags: typeof clientData.tags === 'string' ? clientData.tags.split(',').map(t => t.trim()).filter(t => t) : (clientData.tags || []),
        status: clientData.status || 'new',
      };
      mockClients.unshift(newClient); // Add to the beginning for better UX in table
      resolve(JSON.parse(JSON.stringify(newClient)));
    }, 400);
  });
};

export const updateClient = async (clientId, clientData) => {
  console.log(`[Mock API] Updating client ${clientId}:`, clientData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockClients.findIndex(c => c.id === clientId);
      if (index !== -1) {
        mockClients[index] = { 
            ...mockClients[index], 
            ...clientData,
            tags: typeof clientData.tags === 'string' ? clientData.tags.split(',').map(t => t.trim()).filter(t => t) : (clientData.tags || mockClients[index].tags),
        };
        resolve(JSON.parse(JSON.stringify(mockClients[index])));
      } else {
        reject(new Error(`Client with ID ${clientId} not found during update.`));
      }
    }, 400);
  });
};

export const deleteClient = async (clientId) => {
  console.log(`[Mock API] Deleting client ${clientId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockClients.findIndex(c => c.id === clientId);
      if (index !== -1) {
        const deletedClient = mockClients.splice(index, 1);
        resolve(JSON.parse(JSON.stringify(deletedClient[0])));
      } else {
        reject(new Error(`Client with ID ${clientId} not found for deletion.`));
      }
    }, 300);
  });
};

export const getAvailableTags = async () => {
  return Promise.resolve([...allTags]);
};

export const getClientStatuses = async () => {
  return Promise.resolve([...allStatuses]);
};
