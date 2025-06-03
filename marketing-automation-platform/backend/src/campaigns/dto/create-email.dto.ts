import { IsDateString, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEmailDto {
  @IsNotEmpty({ message: 'Subject should not be empty' })
  @IsString()
  @MinLength(3, { message: 'Subject must be at least 3 characters long' })
  subject: string;

  @IsNotEmpty({ message: 'Body should not be empty' })
  @IsString()
  @MinLength(10, { message: 'Body must be at least 10 characters long' }) // Basic validation for body length
  body: string; // Can be HTML or plain text

  @IsNotEmpty({ message: 'Recipient email should not be empty' })
  @IsEmail({}, { message: 'Invalid recipient email address' })
  recipientEmail: string;

  // 'scheduledAt' was in the requirements, but typical Email model has 'sentAt'.
  // For scheduling, it might be better handled by a separate scheduling service or within campaign logic.
  // For now, I'll include it as per requirements, assuming emails can be scheduled.
  @IsNotEmpty({ message: 'Scheduled date should not be empty' })
  @IsDateString({}, { message: 'Scheduled date must be a valid ISO 8601 date string' })
  scheduledAt: string; // Using string for ISO date format
}
