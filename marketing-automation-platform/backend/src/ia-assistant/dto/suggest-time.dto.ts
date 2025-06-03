import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Re-using SocialPlatform enum from campaigns DTO, or define a specific one if needed
export enum PlatformForTimeSuggestion {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  EMAIL = 'email', // For email send times
  TIKTOK = 'tiktok',
}


export class SuggestTimeDto {
  @IsNotEmpty({ message: 'Platform should not be empty' })
  @IsEnum(PlatformForTimeSuggestion, { message: 'Invalid platform selected' })
  platform: PlatformForTimeSuggestion;

  @IsOptional()
  @IsString()
  businessType?: string;
  
  // Could add more context, e.g., target audience, campaign type, etc.
}
