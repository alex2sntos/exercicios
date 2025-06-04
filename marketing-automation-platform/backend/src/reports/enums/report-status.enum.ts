export enum ReportStatusEnum {
  PENDING = 'pending', // Geração do relatório está em andamento
  GENERATED = 'generated', // Relatório gerado com sucesso
  SENT = 'sent', // Relatório enviado (ex: para WhatsApp)
  VIEWED = 'viewed', // Relatório visualizado pelo usuário (futuro)
  FAILED_TO_GENERATE = 'failed_to_generate', // Falha ao gerar o relatório
  FAILED_TO_SEND = 'failed_to_send', // Falha ao enviar o relatório
}
