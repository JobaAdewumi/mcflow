import {
  Get,
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { WalletService } from '../services/wallet.service';
import { MailService } from './../../mails/services/mail.service';

import { Wallet } from '../models/wallet.interface';
import { NewWithdrawal } from '../models/new-withdrawal.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { UpdateResult } from 'typeorm';

@Controller('wallet')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private mailService: MailService,
  ) {}

  @UseGuards(JwtGuard)
  @Get(':userName')
  walletDetails(@Param('userName') userName: string): Observable<Wallet> {
    return this.walletService.getUserWallet(userName);
  }

  @Get('referral/:userName')
  referralWalletDetails(
    @Param('userName') userName: string,
  ): Observable<Wallet> {
    return this.walletService.getUserReferralWallet(userName);
  }

  @UseGuards(JwtGuard)
  @Post('withdrawal')
  requestWithdrawal(@Body() newWithdrawal: NewWithdrawal) {
    return this.mailService.sendWithdrawalRequest(newWithdrawal);
  }

  @UseGuards(JwtGuard)
  @Put('confirm/mcf')
  deductMcf(@Body() { userName, points }): Observable<UpdateResult> {
    return this.walletService.mcfDeduction(userName, points);
  }

  @UseGuards(JwtGuard)
  @Put('confirm/ref')
  deductRef(@Body() { userName, referralB }): Observable<UpdateResult> {
    return this.walletService.referralDeduction(userName, referralB);
  }
}
