import { Controller, Post, Body, UsePipes, ValidationPipe, Get, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport'; // Correct import for AuthGuard
import { User } from '@prisma/client'; // Import User type

// Define a type for the request object with the user property
interface AuthenticatedRequest extends Request {
  user: Omit<User, 'password'>;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Standard practice to return 200 for successful login
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Example protected route
  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT AuthGuard
  getProfile(@Req() req: AuthenticatedRequest) {
    // req.user is populated by Passport after JWT validation (from JwtStrategy.validate)
    return { message: 'This is a protected profile route.', user: req.user };
  }

  @Get('profile-test-unprotected') // For testing purposes
  getProfileTest() {
    return { message: 'This is an unprotected profile route.'};
  }
}
