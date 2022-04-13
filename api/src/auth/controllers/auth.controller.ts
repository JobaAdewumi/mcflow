import { DeleteResult, UpdateResult } from 'typeorm';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
    return this.authService.generateCouponCode(userPackage).pipe(
      switchMap((couponCode: string) => {
        return of({ couponCode });
      }),
    );
  }

  // @Post('coupon/check')
  // checkCouponCode(@Body() { couponCode }): Promise<{ userPackage: string }> {
  //   return this.authService
  //     .checkCouponCode(couponCode)
  //     .then((userPackage: string) => {
  //       return { userPackage };
  //     });
  // }

  @Post('coupon/check')
  checkCouponCode(@Body() { couponCode }): Observable<{ userPackage: string }> {
    return this.authService.checkDatabaseForCouponCode(couponCode).pipe(
      map((userPackage: string) => {
        return { userPackage };
      }),
    );
  }

  @Post('vendor/accept')
  acceptVendor(
    @Body() { id, firstName, lastName, userName, email, phoneNumber, isActive },
  ): Observable<UpdateResult> {
    console.log(
      '🚀 ~ file: auth.controller.ts ~ line 105 ~ AuthController ~ acceptVendor ~ vendor',
      id,
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      isActive,
    );
    const vendor: Vendor = {
      id,
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      isActive,
    };
    return this.authService.acceptVendor(vendor);
  }

  @Post('vendor/decline')
  declineVendor(
    @Body() { id, firstName, lastName, userName, email, phoneNumber, isActive },
  ): Observable<DeleteResult> {
    const vendor: Vendor = {
      id,
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      isActive,
    };
    return this.authService.declineVendor(vendor);
  }

  @Get('vendor/:userName')
  findVendor(@Param('userName') userName: string): Observable<Vendor> {
    return this.authService.getVendor(userName);
  }
}
