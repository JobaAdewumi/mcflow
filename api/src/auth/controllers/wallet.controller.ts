import { Get, Controller, Param, Post, Body, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';

import { WalletService } from '../services/wallet.service';
import { MailService } from './../../mails/services/mail/mail.service';

import { Wallet } from '../models/wallet.interface';
import { NewWithdrawal } from '../models/new-withdrawal.interface';
import { JwtGuard } from '../guards/jwt.guard';

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

  @UseGuards(JwtGuard)
  @Post('withdrawal')
  requestWithdrawal(@Body() newWithdrawal: NewWithdrawal) {
    console.log('hey', `${newWithdrawal}`);
    return this.mailService.sendWithdrawalRequest(newWithdrawal);
  }
}
