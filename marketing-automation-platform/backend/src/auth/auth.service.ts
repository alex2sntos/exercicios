import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client'; // Import User type from Prisma
import { JwtPayload } from './jwt.strategy'; // Import JwtPayload

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const { email, password, businessName } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          businessName,
        },
      });
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user; // Exclude password from result
      return result;
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`, error.stack);
      // Prisma specific error codes can be checked here if needed
      // e.g. if (error.code === 'P2002') throw new ConflictException('Email already registered');
      throw new ConflictException('Could not register user. Please try again later.');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userResult } = user;
    return { accessToken, user: userResult };
  }

  async validateUser(payload: JwtPayload): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
