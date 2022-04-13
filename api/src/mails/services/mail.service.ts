import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

import { NewWithdrawal } from '../../auth/models/new-withdrawal.interface';
import { ContactUs } from '../../auth/models/contact-us.interface';
import { join } from 'path';
import { Vendor } from '../../auth/models/vendor.class';

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

        subject: 'Requested to contact MCflow',
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

  async sendConfirmVendorRegistration(vendor: Vendor) {
    if (!vendor) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.mailerService
      .sendMail({
        to: 'mcflow.xyz@gmail.com',
        // TODO: Change email "to" address
        // TODO: Need to make html template dynamic
        subject: 'Someone requested to be a vendor',
        html: `<h1>Someone registered to be a coupon vendor, here are the details</h1> <ul><li>Name: ${vendor.firstName} ${vendor.lastName}</li><li>Username: ${vendor.userName}</li><li>Email: ${vendor.email}</li><li>Phone Number: ${vendor.phoneNumber}</li></ul> <p>Go to this page at <a href="http://localhost:4200/auth/vendor/confirm/${vendor.userName}">Click the link to go the confirm vendor page to accept a vendor or decline</a></p>`,
        // TODO: Change the url here
      })
      .then((success) => {})
      .catch((err) => {
        throw new Error(err);
      });
  }

  async sendAcceptVendorRegistration(vendor: Vendor) {
    if (!vendor) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.mailerService
      .sendMail({
        to: `${vendor.email}`,
        // TODO: Change email "to" address
        // TODO: Need to make html template dynamic
        subject: 'You requested to be a vendor',
        html: `<p>Good day ${vendor.firstName}, your request to be a vendor has been accepted you can go to the login page <a href="http://localhost:4200/auth/vendor">here</a> to start generating coupon codes now</p>`,
        // TODO: Change the url here
      })
      .then((success) => {})
      .catch((err) => {
        throw new Error(err);
      });
  }
  async sendDeclineVendorRegistration(vendor: Vendor) {
    if (!vendor) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.mailerService
      .sendMail({
        to: `${vendor.email}`,
        // TODO: Change email "to" address
        // TODO: Need to make html template dynamic
        subject: 'You requested to be a vendor',
        html: `<p>Good day ${vendor.firstName}, your request to be a vendor has been declined at this moment i'm sorry to inform you, the information you provided will be deleted in respect to our privacy policy.`,
        // TODO: Change the url here
      })
      .then((success) => {
        console.log(
          '🚀 ~ file: mail.service.ts ~ line 167 ~ MailService ~ .then ~ success',
          success,
        );
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async couponCodeGeneration(
    email: string,
    userName: string,
    phoneNumber: string,
    packageName: string,
  ) {
    if (!email || !userName || !phoneNumber || !packageName) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.mailerService
      .sendMail({
        to: `jobaadewumi.c@gmail.com`,
        // TODO: Change email "to" address
        // TODO: Need to make html template dynamic
        subject: 'Coupon Code was generated',
        html: `<h1>Coupon code generation</h1> <p>The vendor with the email ${email} Username ${userName} and phone number ${phoneNumber} generated a coupon code for the package ${packageName}</p>`,
        // TODO: Change the url here
      })
      .then((success) => {
        console.log(
          '🚀 ~ file: mail.service.ts ~ line 194 ~ MailService ~ .then ~ success',
          success,
        );
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}
