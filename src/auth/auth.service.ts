import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validatePassword(plain: string, hashed: string): boolean {
    return bcrypt.compareSync(plain, hashed);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  login(userId: number) {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
