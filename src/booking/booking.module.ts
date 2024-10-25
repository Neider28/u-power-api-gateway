import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { GatewayModule } from 'src/websockets/websockets.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ProxyModule,
    GatewayModule,
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
  controllers: [BookingController],
})
export class BookingModule {}
