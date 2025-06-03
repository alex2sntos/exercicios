export enum ActionType {
  SEND_EMAIL = 'send_email', // Enviar um email (usando um template de email)
  SCHEDULE_SOCIAL_POST = 'schedule_social_post', // Agendar um post para uma plataforma social
  UPDATE_CLIENT_TAGS = 'update_client_tags', // Adicionar ou remover tags de um cliente
  ADD_CLIENT_TO_CAMPAIGN = 'add_client_to_campaign', // Adicionar um cliente a uma campanha específica
  SEND_WHATSAPP_MESSAGE = 'send_whatsapp_message', // Enviar uma mensagem de WhatsApp (via integração)
  // Futuros: create_task_in_crm, send_sms, etc.
}
