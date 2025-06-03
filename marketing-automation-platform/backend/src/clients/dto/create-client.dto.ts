import { IsArray, IsEmail, IsOptional, IsString, IsIn, ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateClientDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['active', 'inactive', 'new', 'archived'], { message: 'Invalid status value' })
  status?: string = 'active';

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}
