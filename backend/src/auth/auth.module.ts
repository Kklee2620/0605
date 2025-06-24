import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is not set. Application cannot start.');
        }
        if (secret === 'your-super-secret-jwt-key-here' && process.env.NODE_ENV === 'production') {
            throw new Error('Default JWT_SECRET is being used in production. This is insecure. Please set a strong JWT_SECRET environment variable.');
        }
        return {
          secret: secret,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}