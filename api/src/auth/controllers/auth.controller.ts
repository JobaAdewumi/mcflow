import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { map, Observable, of, switchMap } from 'rxjs';

import { JwtGuard } from './../guards/jwt.guard';

import { UpdatedUser } from './../models/updated-user.class';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.class';
import { Wallet } from '../models/wallet.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Observable<User> {
    return this.authService.registerAccount(user);
  }

  @Post('register/wallet')
  registerWallet(@Body() wallet: Wallet): Observable<Wallet> {
    return this.authService.registerWallet(wallet);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() { email, password }): Observable<{ token: string }> {
    return this.authService
      .login(email, password)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }
}
