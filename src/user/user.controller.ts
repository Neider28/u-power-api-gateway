import { Controller, Body, Patch, Param, UseGuards, Get } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClientProxyUPower } from 'src/common/proxy/client-proxy';
import { UserMSG } from 'src/common/constants';
import { RoleGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { role } from 'src/constants';

@UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly clientProxy: ClientProxyUPower) {}

  private _clientProxyUsers = this.clientProxy.clientProxyUsers();

  @Roles(role.ADMIN, role.STUDENT)
  @Patch(':googleId')
  update(@Param('googleId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._clientProxyUsers.send(UserMSG.UPDATE, { id, updateUserDto });
  }

  @Roles(role.ADMIN)
  @Get()
  findStudents() {
    return this._clientProxyUsers.send(UserMSG.FIND_STUDENTS, {});
  }
}
