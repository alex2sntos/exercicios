import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { User as UserModel } from '@prisma/client'; // Renaming to avoid conflict with req.user

// Define a type for the request object with the user property
interface AuthenticatedRequest extends Request {
  user: Omit<UserModel, 'password'>; // Assuming 'sub' in JWT payload is the user ID
}

@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto, @Req() req: AuthenticatedRequest) {
    // The user ID is available in req.user.id (or req.user.sub if you set it that way in JwtStrategy)
    // Assuming JwtStrategy returns the user object with an 'id' field.
    const userId = req.user.id; 
    return this.clientsService.create(createClientDto, userId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
    @Query('tags') tags?: string, // Tags will come as a comma-separated string
  ) {
    const userId = req.user.id;
    let tagsArray: string[] | undefined = undefined;
    if (tags) {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return this.clientsService.findAll(userId, status, tagsArray);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.clientsService.findOne(id, userId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.clientsService.update(id, updateClientDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.clientsService.remove(id, userId);
  }
}
