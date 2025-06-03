import { PartialType } from '@nestjs/mapped-types'; // Utility for creating DTOs with optional fields
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {}
