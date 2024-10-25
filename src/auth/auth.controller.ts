import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthMSG } from 'src/common/constants';
import { ClientProxyUPower } from 'src/common/proxy/client-proxy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly clientProxy: ClientProxyUPower) {}

  private _clientProxyAuth = this.clientProxy.clientProxyAuth();

  @Post('google')
  loginWithGoogle(@Body('token') token: string): Observable<any> {
    return this._clientProxyAuth.send(AuthMSG.LOGIN_GOOGLE, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    const token = req['token'];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub.toString();

    return this._clientProxyAuth.send(AuthMSG.PROFILE, id);
  }
}
