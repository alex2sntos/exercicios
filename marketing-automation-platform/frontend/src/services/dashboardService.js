// Mocked dashboard service
// In a real application, this would fetch data from the backend API.

export const getDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activeCampaigns: Math.floor(Math.random() * 10) + 1, // Random number between 1 and 10
        totalClients: Math.floor(Math.random() * 200) + 50,  // Random number between 50 and 250
        emailsSentThisMonth: Math.floor(Math.random() * 1000) + 200, // Random 200-1200
        scheduledPosts: Math.floor(Math.random() * 20) + 5,     // Random 5-25
        conversionRate: (Math.random() * 5 + 1).toFixed(1) + '%', // Random 1.0-6.0%
        // Example change values for StatCards
        activeCampaignsChange: { type: Math.random() > 0.5 ? 'increase' : 'decrease', value: `${(Math.random() * 10).toFixed(0)}%`},
        totalClientsChange: { type: 'increase', value: `${(Math.random() * 5).toFixed(0)}%`},
      });
    }, 700); // Simulate API delay
  });
};

export const getRecommendations = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, text: "Considere criar uma campanha de e-mail para reengajar clientes inativos." , type: "suggestion"},
                { id: 2, text: "Seu post sobre 'Novidades de Verão' teve um ótimo desempenho no Instagram. Crie mais conteúdo similar!", type: "insight"},
                { id: 3, text: "Agende posts para os horários de pico: 18h durante a semana e 11h aos sábados.", type: "tip"},
            ]);
        }, 1200);
    });
};

export const getRecentActivities = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'act1', description: "Campanha 'Promoção de Férias' iniciada.", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "campaign_started"},
                { id: 'act2', description: "Novo cliente 'Ana Silva' adicionado.", timestamp: new Date(Date.now() - 7200000).toISOString(), type: "client_added"},
                { id: 'act3', description: "E-mail 'Newsletter de Julho' enviado para 250 contatos.", timestamp: new Date(Date.now() - 86400000).toISOString(), type: "email_sent"},
                { id: 'act4', description: "Post 'Dicas de Verão' publicado no Instagram.", timestamp: new Date(Date.now() - 172800000).toISOString(), type: "social_post_published"},
            ]);
        }, 500);
    });
};
