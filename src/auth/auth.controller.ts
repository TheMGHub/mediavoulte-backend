import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() body: { password: string }) {
    const expectedPassword = process.env.AUTH_PASSWORD || 'password';

    if (!this.authService.validatePassword(body.password, process.env.AUTH_PASSWORD_HASH || '')) {
      // Simple hardcoded check for personal use
      if (body.password !== expectedPassword) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    // Get or create user (single user for personal setup)
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: { email: 'admin@mediavault.local' },
      });
    }

    return this.authService.login(user.id);
  }
}
