import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type EmailProvider = 'sendgrid' | 'mailchimp';

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  provider: EmailProvider;
  message: string;
}

@Injectable()
export class EmailProvidersService {
  private readonly logger = new Logger(EmailProvidersService.name);
  private sendgridApiKey: string;
  private mailchimpApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.mailchimpApiKey = this.configService.get<string>('MAILCHIMP_API_KEY');

    if (!this.sendgridApiKey) {
      this.logger.warn('SendGrid API Key is not configured.');
    }
    if (!this.mailchimpApiKey) {
      this.logger.warn('Mailchimp API Key is not configured.');
    }
  }

  async sendTransactionalEmail(
    provider: EmailProvider,
    // apiKey: string, // API key can be retrieved from ConfigService based on provider
    to: string,
    from: string, // Should comply with provider's verified sender policies
    subject: string,
    htmlContent: string,
  ): Promise<SendEmailResponse> {
    let apiKey: string;
    if (provider === 'sendgrid') {
      apiKey = this.sendgridApiKey;
    } else if (provider === 'mailchimp') {
      apiKey = this.mailchimpApiKey;
    } else {
      throw new BadRequestException(`Unsupported email provider: ${provider}`);
    }

    if (!apiKey) {
      this.logger.error(`API Key for ${provider} is not configured. Cannot send email.`);
      return { 
        success: false, 
        provider,
        message: `API Key for ${provider} not configured.`
      };
    }

    this.logger.log(
      `Simulating sending transactional email via ${provider} (API Key: ${apiKey.substring(0,5)}...)
      To: ${to}, From: ${from}, Subject: "${subject}"`,
    );

    // Real call simulation
    // For SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(apiKey);
    // const msg = { to, from, subject, html: htmlContent };
    // await sgMail.send(msg);

    // For Mailchimp (Transactional - formerly Mandrill):
    // const mailchimp = require('@mailchimp/mailchimp_transactional')(apiKey);
    // const message = { html: htmlContent, subject, from_email: from, to: [{ email: to }] };
    // await mailchimp.messages.send({ message });

    await new Promise(resolve => setTimeout(resolve, 400));
    const mockMessageId = `${provider}_mock_${Date.now()}`;
    
    return { 
      success: true, 
      messageId: mockMessageId, 
      provider,
      message: `Simulated: Email sent successfully via ${provider}.`
    };
  }
}
