import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface FacebookPage {
  id: string;
  name: string;
  accessToken: string; // Page access token
}

interface InstagramBusinessAccount {
  id: string;
  username: string;
  // Potentially more fields like profile_picture_url, followers_count etc.
}

@Injectable()
export class MetaApiService {
  private readonly logger = new Logger(MetaApiService.name);
  private metaAppId: string;
  private metaAppSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.metaAppId = this.configService.get<string>('META_APP_ID');
    this.metaAppSecret = this.configService.get<string>('META_APP_SECRET');

    if (!this.metaAppId || !this.metaAppSecret) {
      this.logger.warn('Meta App ID or Secret is not configured. Real API calls will fail.');
    }
  }

  async getUserFacebookPages(userAccessToken: string): Promise<FacebookPage[]> {
    this.logger.log(`Simulating fetching Facebook pages for user with token: ${userAccessToken.substring(0, 10)}...`);
    // In a real scenario, you'd use userAccessToken to call Meta Graph API:
    // GET /me/accounts?access_token={userAccessToken}
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return [
      { id: 'fb_page_123', name: 'Minha Página de Negócios Bacana', accessToken: 'mock_page_access_token_123' },
      { id: 'fb_page_456', name: 'Outra Página Fantástica', accessToken: 'mock_page_access_token_456' },
    ];
  }

  async postToFacebookPage(pageAccessToken: string, message: string, mediaUrl?: string): Promise<{ id: string }> {
    this.logger.log(
      `Simulating posting to Facebook page (token: ${pageAccessToken.substring(0,10)}...): "${message}" ${mediaUrl ? 'with media: ' + mediaUrl : ''}`,
    );
    // Real call: POST /{page_id}/feed?message={message}&access_token={pageAccessToken}
    // Or for media: POST /{page_id}/photos?url={mediaUrl}&caption={message}&access_token={pageAccessToken}
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: `fb_post_mock_${Date.now()}` };
  }

  async getInstagramBusinessAccounts(userAccessToken: string): Promise<InstagramBusinessAccount[]> {
    this.logger.log(`Simulating fetching Instagram Business accounts for user with token: ${userAccessToken.substring(0,10)}...`);
    // Real call: GET /{fb_page_id}?fields=instagram_business_account&access_token={pageAccessToken}
    // Then: GET /{ig_business_account_id}?fields=username,profile_picture_url&access_token={pageAccessToken}
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 'ig_biz_account_789', username: 'MeuNegocioInsta' },
      { id: 'ig_biz_account_012', username: 'InstaFantastico' },
    ];
  }

  async postToInstagram(igUserAccessToken: string, mediaUrl: string, caption: string): Promise<{ id: string }> {
    this.logger.log(
      `Simulating posting to Instagram (token: ${igUserAccessToken.substring(0,10)}...): "${caption}" with media: ${mediaUrl}`,
    );
    // Real call: This is more complex, involves creating a media container first, then publishing it.
    // 1. POST /{ig_user_id}/media?image_url={mediaUrl}&caption={caption}&access_token={igUserAccessToken}
    // 2. POST /{ig_user_id}/media_publish?creation_id={creation_id_from_step_1}&access_token={igUserAccessToken}
    await new Promise(resolve => setTimeout(resolve, 700));
    return { id: `ig_post_mock_${Date.now()}` };
  }
}
