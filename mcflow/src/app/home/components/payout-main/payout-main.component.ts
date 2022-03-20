import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { ErrorHandlerService } from '../../../core/services/error-handler.service';

import { User } from '../../../auth/models/user.model';
import { Wallet } from './../../../auth/models/wallet.model';
import { NewWithdrawal } from '../../models/withdrawal.model';

import { AuthService } from './../../../auth/services/auth.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-payout-main',
  templateUrl: './payout-main.component.html',
  styleUrls: ['./payout-main.component.scss'],
})
export class PayoutMainComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  private user$ = new BehaviorSubject<User>(null);

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  mcfPoints: number;
  referralBalance: number;
  userName: string;
  userPackage: string;
  email: string;

  ngOnInit(): void {
    this.authService.userName.pipe(take(1)).subscribe((userName: string) => {
      this.userName = userName;
      this.user$.next(userName as any);
    });

    this.homeService
      .getUserWallet(this.userName)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          this.mcfPoints = wallet.mcfPoints;
          this.referralBalance = wallet.referralBalance;
        })
      )
      .subscribe();

    this.authService.userPackage
      .pipe(take(1))
      .subscribe((userPackage: string) => {
        this.userPackage = userPackage;
        this.user$.next(userPackage as any);
      });

    this.authService.email.pipe(take(1)).subscribe((email: string) => {
      this.email = email;
      this.user$.next(email as any);
    });
  }

  onSubmit() {
    const {
      referralOrMCFPoints,
      withdrawalAmount,
      accountName,
      accountNumber,
      bankName,
    } = this.form.value;
    if (
      !referralOrMCFPoints ||
      !withdrawalAmount ||
      !accountName ||
      !accountNumber ||
      !bankName
    )
      return null;
    console.log('hello', `${this.userPackage}`);
    console.log('points', `${this.mcfPoints}`);
    console.log('referral', `${this.referralBalance}`, referralOrMCFPoints);
    console.log('userName', `${this.userName}`);
    if (referralOrMCFPoints == 'referral') {
      if (this.referralBalance < 3000) {
        this.errorHandlerService.openSnackBar(
          'Referral balance is not up to the minimum'
        );
        return null;
      }
    }
    if (referralOrMCFPoints == 'mcfpoints') {
      if (this.userPackage == 'bronze' && this.mcfPoints < 10000) {
        this.errorHandlerService.openSnackBar(
          'Mcf Points is not up to the minimum for withdrawal'
        );
        return null;
      } else if (this.userPackage == 'silver' && this.mcfPoints < 25000) {
        this.errorHandlerService.openSnackBar(
          'Mcf Points is not up to the minimum for withdrawal'
        );
        return null;
      } else if (this.userPackage == 'gold' && this.mcfPoints < 48000) {
        this.errorHandlerService.openSnackBar(
          'Mcf Points is not up to the minimum for withdrawal'
        );
        return null;
      } else if (this.userPackage == 'pioneer' && this.mcfPoints < 110000) {
        this.errorHandlerService.openSnackBar(
          'Mcf Points is not up to the minimum for withdrawal'
        );
        return null;
      }
    }
    // TODO: Add the other packages and continue from here
    const newWithdrawal: NewWithdrawal = {
      email: this.email,
      referralOrMCFPoints,
      withdrawalAmount,
      accountName,
      accountNumber,
      bankName,
    };

    return this.homeService
      .sendWithdrawal(newWithdrawal)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar(
            'An error occurred please try again later'
          );
          console.log('error:', err);
          return throwError(err);
        })
      )
      .subscribe(
        // res =>
        //   this.errorHandlerService.openSuccessSnackBar(`Login res successfully: ${res}`),
        // err =>
        //   this.errorHandlerService.handleError(
        //     `wrong email or password: ${err}`,

        //   ),

        () => {
          this.errorHandlerService.openSuccessSnackBar(
            'Form sent successfully'
          );
        }
      );
  }
}
