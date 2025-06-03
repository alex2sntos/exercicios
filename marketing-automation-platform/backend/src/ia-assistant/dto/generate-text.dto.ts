import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export enum ContentType {
  SOCIAL_POST_CAPTION = 'social_post_caption',
  EMAIL_SUBJECT = 'email_subject',
  EMAIL_BODY = 'email_body',
  BLOG_POST_TITLE = 'blog_post_title',
  PRODUCT_DESCRIPTION = 'product_description',
  AD_COPY = 'ad_copy',
}

export enum CommunicationTone {
  AMIGAVEL = 'amigável',
  PROFISSIONAL = 'profissional',
  ENGRAÇADO = 'engraçado',
  FORMAL = 'formal',
  INFORMAL = 'informal',
  PERSUASIVO = 'persuasivo',
  EMPATICO = 'empático',
}

export class GenerateTextDto {
  @IsNotEmpty({ message: 'Business type should not be empty' })
  @IsString()
  businessType: string;

  @IsNotEmpty({ message: 'Campaign goal should not be empty' })
  @IsString()
  campaignGoal: string;

  @IsNotEmpty({ message: 'Content type should not be empty' })
  @IsEnum(ContentType, { message: 'Invalid content type selected' })
  contentType: ContentType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10) // Limiting keywords for prompt simplicity
  keywords?: string[];

  @IsOptional()
  @IsEnum(CommunicationTone, { message: 'Invalid communication tone selected' })
  tone?: CommunicationTone = CommunicationTone.AMIGAVEL;
}
