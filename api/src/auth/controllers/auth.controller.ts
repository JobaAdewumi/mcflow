import { UpdateResult } from 'typeorm';
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
import { Vendor } from '../models/vendor.class';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Observable<User> {
    return this.authService.registerAccount(user);
  }

  @Post('register/vendor')
  registerVendor(@Body() vendor: Vendor): Observable<Vendor> {
    return this.authService.registerVendorAccount(vendor);
  }

  @Post('register/wallet')
  registerWallet(@Body() wallet: Wallet): Observable<Wallet> {
    return this.authService.registerWallet(wallet);
  }

  @UseGuards(JwtGuard)
  @Put('login/date')
  loginDate(@Request() req): Observable<UpdateResult> {
    const userId = req.user.id;
    return this.authService.loginDate(userId);
  }

  @UseGuards(JwtGuard)
  @Put('shared/date')
  sharedDate(@Request() req): Observable<UpdateResult> {
    const userId = req.user.id;
    return this.authService.sharedDate(userId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() { email, password }): Observable<{ token: string }> {
    return this.authService
      .login(email, password)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  @Post('login/vendor')
  @HttpCode(HttpStatus.OK)
  loginVendor(@Body() { email, password }): Observable<{ token: string }> {
    return this.authService
      .loginVendor(email, password)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  @Post('coupon/generate')
  generateCouponCode(
    @Body() { userPackage },
  ): Observable<{ couponCode: string }> {
    console.log(
      '🚀 ~ file: auth.controller.ts ~ line 75 ~ AuthController ~ generateCouponCode ~ userPackage',
      userPackage,
    );
    return this.authService.generateCouponCode(userPackage).pipe(
      switchMap((couponCode: string) => {
        return of({ couponCode });
      }),
    );
  }

  @Post('coupon/check')
  checkCouponCode(@Body() { couponCode }): Promise<{ userPackage: string }> {
    console.log(
      '🚀 ~ file: auth.controller.ts ~ line 85 ~ AuthController ~ checkCouponCode ~ couponCode',
      couponCode,
    );
    return this.authService
      .checkCouponCode(couponCode)
      .then((userPackage: string) => {
        return { userPackage };
      });
  }
}
