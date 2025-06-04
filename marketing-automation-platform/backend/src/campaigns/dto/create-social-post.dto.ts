import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  WHATSAPP = 'whatsapp',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter', // X
  TIKTOK = 'tiktok',
  OTHER = 'other',
}

export class CreateSocialPostDto {
  @IsNotEmpty({ message: 'Platform should not be empty' })
  @IsEnum(SocialPlatform, { message: 'Invalid social media platform selected' })
  platform: SocialPlatform;

  @IsNotEmpty({ message: 'Content text should not be empty' })
  @IsString()
  @MinLength(1, { message: 'Content text cannot be empty' })
  contentText: string;

  @IsOptional()
  @IsUrl({}, { message: 'Media URL must be a valid URL' })
  mediaUrl?: string;

  @IsNotEmpty({ message: 'Scheduled date should not be empty' })
  @IsDateString({}, { message: 'Scheduled date must be a valid ISO 8601 date string' })
  scheduledAt: string; // Using string for ISO date format
}
