import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

import { NewWithdrawal } from '../../auth/models/new-withdrawal.interface';
import { ContactUs } from '../../auth/models/contact-us.interface';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  dirname = join(process.cwd(), 'src/mails/templates');

  async sendWithdrawalRequest(newWithdrawal: NewWithdrawal) {
    if (!newWithdrawal) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.mailerService
      .sendMail({
        to: newWithdrawal.email,

        // TODO: Need to make html template dynamic
        subject: 'Request for withdrawal',
        template: join(this.dirname + './confirmation'),

        context: {
          referralOrMcfPoints: newWithdrawal.referralOrMCFPoints,
          name: newWithdrawal.accountName,
          number: newWithdrawal.accountNumber,
          bank: newWithdrawal.bankName,
          amount: newWithdrawal.withdrawalAmount,
          userName: newWithdrawal.userName,
        },
      })
      .then((success) => {
        this.sendWithdrawalRequestToMCflow(newWithdrawal);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async sendWithdrawalRequestToMCflow(newWithdrawal: NewWithdrawal) {
    if (!newWithdrawal) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.mailerService
      .sendMail({
        to: 'jobaadewumi.c@gmail.com',

        subject: 'Request for withdrawal',

        template: join(this.dirname + './withdrawalrequest'),

        context: {
          referralOrMcfPoints: newWithdrawal.referralOrMCFPoints,
          name: newWithdrawal.accountName,
          number: newWithdrawal.accountNumber,
          bank: newWithdrawal.bankName,
          amount: newWithdrawal.withdrawalAmount,
          userName: newWithdrawal.userName,
        },
      })
      .then((success) => {})
      .catch((err) => {
        throw new Error(err);
      });
  }

  async sendContactUsInfo(contactUs: ContactUs) {
    if (!contactUs) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.mailerService
      .sendMail({
        to: contactUs.email,

        // TODO: Need to make html template dynamic
        subject: 'Request for withdrawal',
        template: join(this.dirname + './contactus'),

        context: {
          name: contactUs.name,
          phoneNumber: contactUs.phoneNumber,
          message: contactUs.message,
          email: contactUs.email,
        },
      })
      .then((success) => {})
      .catch((err) => {
        throw new Error(err);
      });
  }
}
