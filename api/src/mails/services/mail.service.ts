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
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
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
        to: 'contact@mcflow.xyz',

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
      .catch((err) => {
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
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
        to: 'contact@mcflow.xyz',

        subject: 'Requested to contact MCflow',
        template: join(this.dirname + './contactus'),

        context: {
          name: contactUs.name,
          phoneNumber: contactUs.phoneNumber,
          message: contactUs.message,
          email: contactUs.email,
        },
      })
      .catch((err) => {
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
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
        to: 'contact@mcflow.xyz',
        subject: 'Someone requested to be a vendor',
        html: `<h1>Someone registered to be a coupon vendor, here are the details</h1> <ul><li>Name: ${vendor.firstName} ${vendor.lastName}</li><li>Username: ${vendor.userName}</li><li>Email: ${vendor.email}</li><li>Phone Number: ${vendor.phoneNumber}</li></ul> <p>Go to this page at <a href="${process.env.CURRENT_URL}/auth/vendor/confirm/${vendor.userName}">Click the link to go the confirm vendor page to accept a vendor or decline</a></p>`,
      })
      .then((success) => {
        this.sendConfirmVendorRegistrationToVendor(vendor);
      })
      .catch((err) => {
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
      });
  }
  async sendConfirmVendorRegistrationToVendor(vendor: Vendor) {
    if (!vendor) {
      throw new HttpException(
        "Withdrawal criteria wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.mailerService
      .sendMail({
        to: vendor.email,
        subject: 'You requested to be a vendor',
        html: `<h1>You registered to be a coupon vendor</h1> <p>And  your username is ${vendor.userName}</p>
        <p>Please be patient as we verify your request and you will receive another email, please check your spam folder</p> `,
      })

      .catch((err) => {
       throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
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

        subject: 'You requested to be a vendor',
        html: `<p>Good day ${vendor.firstName}, your request to be a vendor has been accepted you can go to the login page <a href="${process.env.CURRENT_URL}/auth/vendor">here</a> to start generating coupon codes now</p>`,
      })
      .catch((err) => {
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
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
        subject: 'You requested to be a vendor',
        html: `<p>Good day ${vendor.firstName}, your request to be a vendor has been declined at this moment i'm sorry to inform you, the information you provided will be deleted in respect to our privacy policy.`,
      })

      .catch((err) => {
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
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
        to: `contact@mcflow.xyz`,

        subject: 'Coupon Code was generated',
        html: `<h1>Coupon code generation</h1> <p>The vendor with the email ${email} Username ${userName} and phone number ${phoneNumber} generated a coupon code for the package ${packageName}</p>`,
      })

      .catch((err) => {
        throw new HttpException(
            'An Error sending email',
            HttpStatus.BAD_REQUEST,
          );
      });
  }
}
