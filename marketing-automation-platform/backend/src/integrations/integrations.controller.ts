import { Controller, Post, Body, UseGuards, Logger, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MetaApiService } from './meta-api.service';
import { GmailApiService } from './gmail-api.service';
import { EmailProvidersService } from './email-providers.service';
import { User as UserModel } from '@prisma/client';

// Simple DTOs for testing controller endpoints
class TestFacebookPostDto {
  pageAccessToken: string = 'mock_page_access_token_123'; // Default mock token
  message: string;
  mediaUrl?: string;
}

class TestGmailSendDto {
  userAccessToken: string = 'mock_user_gmail_access_token'; // Default mock token
  to: string;
  subject: string;
  body: string;
}

class TestTransactionalEmailDto {
  provider: 'sendgrid' | 'mailchimp';
  to: string;
  from: string;
  subject: string;
  htmlContent: string;
}

interface AuthenticatedRequest extends Request {
  user: Omit<UserModel, 'password'>; // Assuming 'sub' in JWT payload is the user ID
}


@UseGuards(AuthGuard('jwt')) // Protect all routes in this controller
@Controller('integrations')
export class IntegrationsController {
  private readonly logger = new Logger(IntegrationsController.name);

  constructor(
    private readonly metaApiService: MetaApiService,
    private readonly gmailApiService: GmailApiService,
    private readonly emailProvidersService: EmailProvidersService,
  ) {}

  @Post('test-facebook-pages')
  @HttpCode(HttpStatus.OK)
  async testFacebookPages(@Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing Facebook Pages fetch.`);
    // In a real app, userAccessToken would come from user's stored credentials
    const mockUserAccessToken = 'mock_fb_user_long_lived_token';
    return this.metaApiService.getUserFacebookPages(mockUserAccessToken);
  }

  @Post('test-facebook-post')
  @HttpCode(HttpStatus.OK)
  async testFacebookPost(@Body() dto: TestFacebookPostDto, @Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing Facebook post.`);
    return this.metaApiService.postToFacebookPage(dto.pageAccessToken, dto.message, dto.mediaUrl);
  }
  
  @Post('test-instagram-accounts')
  @HttpCode(HttpStatus.OK)
  async testInstagramAccounts(@Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing Instagram Accounts fetch.`);
    const mockUserAccessToken = 'mock_ig_user_long_lived_token'; // This would typically be the same FB token
    return this.metaApiService.getInstagramBusinessAccounts(mockUserAccessToken);
  }

  @Post('test-instagram-post')
  @HttpCode(HttpStatus.OK)
  async testInstagramPost(@Body() dto: { igUserAccessToken?: string, mediaUrl: string, caption: string }, @Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing Instagram post.`);
    const token = dto.igUserAccessToken || 'mock_ig_user_access_token_for_posting';
    return this.metaApiService.postToInstagram(token, dto.mediaUrl, dto.caption);
  }

  @Post('test-send-gmail')
  @HttpCode(HttpStatus.OK)
  async testSendGmail(@Body() dto: TestGmailSendDto, @Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing Gmail send.`);
    return this.gmailApiService.sendEmail(dto.userAccessToken, dto.to, dto.subject, dto.body);
  }
  
  @Post('test-gmail-labels')
  @HttpCode(HttpStatus.OK)
  async testGmailLabels(@Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing Gmail labels fetch.`);
    const mockUserAccessToken = 'mock_user_gmail_access_token_for_labels';
    return this.gmailApiService.listUserLabels(mockUserAccessToken);
  }

  @Post('test-transactional-email')
  @HttpCode(HttpStatus.OK)
  async testSendTransactionalEmail(@Body() dto: TestTransactionalEmailDto, @Req() req: AuthenticatedRequest) {
    this.logger.log(`User ${req.user.id} testing transactional email via ${dto.provider}.`);
    return this.emailProvidersService.sendTransactionalEmail(
      dto.provider,
      dto.to,
      dto.from,
      dto.subject,
      dto.htmlContent,
    );
  }
}
