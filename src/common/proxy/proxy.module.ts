import { Module } from '@nestjs/common';
import { ClientProxyUPower } from './client-proxy';

@Module({
  providers: [ClientProxyUPower],
  exports: [ClientProxyUPower],
})
export class ProxyModule {}
