import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

import { from, Observable } from 'rxjs';
import fs from 'node:fs';

import { NewWithdrawal } from './../../../auth/models/new-withdrawal.interface';
import { ContactUs } from '../../../auth/models/contact-us.interface';
import handlebars from 'handlebars';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  dirname = join(process.cwd(), 'src/mails/templates/confirmation.html');

  // readHTMLFile(dirname) {
  //   var template = handlebars.compile(dirname);
  //   var replacements = {
  //     username: "John Doe"
  //   };
  //   var htmlToSend = template(replacements);
  //   var mailOptions = {
  //     from: 'my@email.com',
  //     to: 'some@email.com',
  //     subject: 'test subject',
  //     html: htmlToSend
  //   };

  // }

  async sendWithdrawalRequest(newWithdrawal: NewWithdrawal) {
    if (!newWithdrawal) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log('hey', `${newWithdrawal}`);
    await this.mailerService
      .sendMail({
        to: newWithdrawal.email,

        // TODO: Need to make html template dynamic
        subject: 'Request for withdrawal',
        // html: `<p>Hey {{email}},</p> <p>You have requested to withdraw your {{referralOrMcfPoints}}</p> <p>The details with the {{name}} and the {{number}} belonging to {{bank}}, you requested to withdraw{{amount}}</p> <p>You will receive your money in the next hour, Thank you.</p>`,

        template: this.dirname,

        context: {
          referralOrMcfPoints: newWithdrawal.referralOrMCFPoints,
          name: newWithdrawal.accountName,
          number: newWithdrawal.accountNumber,
          bank: newWithdrawal.bankName,
          amount: newWithdrawal.withdrawalAmount,
          email: newWithdrawal.email,
        },
      })
      .then((success) => {
        console.log(`${success}`);
      })
      .catch((err) => {
        console.log(`${err}`);
        throw new Error(err);
      });
    console.log('hey', `${newWithdrawal}`);
  }

  async sendContactUsInfo(contactUs: ContactUs) {
    if (!contactUs) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('hey', `${contactUs}`);
    await this.mailerService
      .sendMail({
        to: contactUs.email,

        // TODO: Need to make html template dynamic
        subject: 'Request for withdrawal',
        html: `<p>Hey {{email}},</p> <p>You have requested to withdraw your {{referralOrMcfPoints}}</p> <p>The details with the {{name}} and the {{number}} belonging to {{bank}}, you requested to withdraw{{amount}}</p> <p>You will receive your money in the next hour, Thank you.</p>`,

        context: {
          name: contactUs.name,
          phoneNumber: contactUs.phoneNumber,
          message: contactUs.message,
          email: contactUs.email,
        },
      })
      .then((success) => {
        console.log(`${success}`);
      })
      .catch((err) => {
        console.log(`${err}`, 'hello');
        throw new Error(err);
      });
    console.log('hey', `${contactUs}`);
  }
}
// function readHTMLFile(dirname: string) {
//   throw new Error('Function not implemented.');
// }
