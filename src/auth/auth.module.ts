import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ProxyModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          audience: config.get('APP_URL'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
