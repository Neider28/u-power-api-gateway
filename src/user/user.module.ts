import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ProxyModule,
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
  controllers: [UserController],
})
export class UserModule {}
