export enum TriggerType {
  CLIENT_CREATED = 'client_created', // Disparado quando um novo cliente é adicionado
  CLIENT_TAG_ADDED = 'client_tag_added', // Disparado quando uma tag específica é adicionada a um cliente
  CLIENT_BIRTHDAY = 'client_birthday', // Disparado X dias antes do aniversário do cliente
  CAMPAIGN_INTERACTION = 'campaign_interaction', // Ex: cliente abriu email, clicou em link de campanha
  SPECIFIC_DATE = 'specific_date', // Disparado em uma data e hora específicas
  RECURRING_SCHEDULE = 'recurring_schedule', // Ex: toda segunda-feira às 9h
  // Futuros: webhook_received, product_purchased, etc.
}
