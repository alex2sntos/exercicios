import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
}

@Injectable()
export class GmailApiService {
  private readonly logger = new Logger(GmailApiService.name);
  private gmailClientId: string;
  private gmailClientSecret: string;
  private gmailRedirectUri: string;

  constructor(private readonly configService: ConfigService) {
    this.gmailClientId = this.configService.get<string>('GMAIL_CLIENT_ID');
    this.gmailClientSecret = this.configService.get<string>('GMAIL_CLIENT_SECRET');
    this.gmailRedirectUri = this.configService.get<string>('GMAIL_REDIRECT_URI');

    if (!this.gmailClientId || !this.gmailClientSecret || !this.gmailRedirectUri) {
      this.logger.warn('Gmail API credentials not fully configured. Real API calls will fail.');
    }
  }

  async sendEmail(userAccessToken: string, to: string, subject: string, body: string): Promise<{ id: string; threadId: string }> {
    this.logger.log(
      `Simulating sending email via Gmail (token: ${userAccessToken.substring(0,10)}...) to: ${to}, Subject: "${subject}"`,
    );
    // Real call: POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send
    // Body would be a base64url encoded email message.
    // Requires 'https://www.googleapis.com/auth/gmail.send' scope.
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockId = `gmail_msg_mock_${Date.now()}`;
    return { id: mockId, threadId: `gmail_thread_mock_${Date.now()}` };
  }

  async listUserLabels(userAccessToken: string): Promise<GmailLabel[]> {
    this.logger.log(`Simulating fetching Gmail labels for user (token: ${userAccessToken.substring(0,10)}...)`);
    // Real call: GET https://gmail.googleapis.com/gmail/v1/users/me/labels
    // Requires 'https://www.googleapis.com/auth/gmail.labels' scope.
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 'INBOX', name: 'INBOX', type: 'system' },
      { id: 'SENT', name: 'SENT', type: 'system' },
      { id: 'STARRED', name: 'STARRED', type: 'system' },
      { id: 'Label_1', name: 'Trabalho', type: 'user' },
      { id: 'Label_2', name: 'Pessoal', type: 'user' },
    ];
  }

  // Future methods:
  // - getEmail(messageId: string, userAccessToken: string)
  // - listEmails(query: string, userAccessToken: string)
  // - createDraft(draft: any, userAccessToken: string)
}
