import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SuggestImageDto {
  @IsNotEmpty({ message: 'Business type should not be empty' })
  @IsString()
  businessType: string;

  @IsNotEmpty({ message: 'Campaign goal should not be empty' })
  @IsString()
  campaignGoal: string;

  @IsOptional()
  @IsString()
  textContext?: string; // Text that the image should relate to
}
