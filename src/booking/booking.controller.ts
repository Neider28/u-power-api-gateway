import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BookingMSG } from 'src/common/constants';
import { ClientProxyUPower } from 'src/common/proxy/client-proxy';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';
import { RoleGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { role } from 'src/constants';

@UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly clientProxy: ClientProxyUPower) {}

  private _clientProxyBooking = this.clientProxy.clientProxyBookings();

  @Roles(role.ADMIN, role.STUDENT)
  @Get()
  findAll(@Req() req: Request): Observable<any> {
    const token = req['token'];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub.toString();

    // this.bookingGateway.handleMessage('Get Bookings');
    return this._clientProxyBooking.send(BookingMSG.FIND_ALL, id);
  }

  @Roles(role.ADMIN, role.STUDENT)
  @Get('pendings')
  findPendings(@Req() req: Request): Observable<any> {
    const token = req['token'];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub.toString();

    return this._clientProxyBooking.send(BookingMSG.FIND_PENDINGS, id);
  }

  @Roles(role.ADMIN)
  @Get('history/user/:id')
  historyByUser(@Param('id') id: string): Observable<any> {
    return this._clientProxyBooking.send(BookingMSG.HISTORY_BY_USER, id);
  }

  @Roles(role.ADMIN)
  @Post('register-attendance')
  registerAttendance(
    @Body() createBookingDto: CreateBookingDto,
  ): Observable<any> {
    return this._clientProxyBooking.send(BookingMSG.REGISTER_ATTENDANCE, {
      createBookingDto,
    });
  }

  @Roles(role.ADMIN)
  @Post('history')
  history(@Body() createBookingDto: CreateBookingDto): Observable<any> {
    return this._clientProxyBooking.send(BookingMSG.HISTORY, {
      createBookingDto,
    });
  }

  @Roles(role.ADMIN, role.STUDENT)
  @Post('verify')
  verify(
    @Req() req: Request,
    @Body() createBookingDto: CreateBookingDto,
  ): Observable<any> {
    const token = req['token'];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub.toString();

    return this._clientProxyBooking.send(BookingMSG.VERIFY, {
      id,
      createBookingDto,
    });
  }

  @Roles(role.ADMIN, role.STUDENT)
  @Post()
  create(
    @Req() req: Request,
    @Body() createBookingDto: CreateBookingDto,
  ): Observable<any> {
    const token = req['token'];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.sub.toString();

    return this._clientProxyBooking.send(BookingMSG.CREATE, {
      id,
      createBookingDto,
    });
  }

  @Roles(role.ADMIN)
  @Patch('attended/:id')
  attended(@Param('id') id: string) {
    return this._clientProxyBooking.send(BookingMSG.ATTENDED, id);
  }

  @Roles(role.ADMIN)
  @Patch('no-attended/:id')
  noAttended(@Param('id') id: string) {
    return this._clientProxyBooking.send(BookingMSG.NO_ATTENDED, id);
  }

  @Roles(role.ADMIN, role.STUDENT)
  @Patch('cancel/:id')
  cancel(@Param('id') id: string) {
    return this._clientProxyBooking.send(BookingMSG.CANCEL, id);
  }
}
