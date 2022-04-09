import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators';
import { NewUser } from '../auth/models/newUser.model';
import { NewWallet } from '../auth/models/newWallet.model';
import { UserPackage } from '../auth/models/package.enum';
import { Wallet } from '../auth/models/wallet.model';
import { AuthService } from '../auth/services/auth.service';
import { ErrorHandlerService } from '../core/services/error-handler.service';
import { ReferralService } from './services/referral.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss'],
})
export class ReferralComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  mcfPoints: number;
  referralBalance: number;
  userName: string;
  userPackage: UserPackage;
  referred: number;

  urlUsername: string;

  constructor(
    private authService: AuthService,
    private referralService: ReferralService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getUsernameFromUrl();

    this.referralService
      .getUserWallet(this.urlUsername)
      .pipe(
        tap((wallet: Wallet) => {
          this.referred = wallet.referred;
          this.userPackage = wallet.userPackage;
          this.referralBalance = wallet.referralBalance;
        }),
        catchError((err) => {
          this.errorHandlerService.openSnackBar(
            'The user associated with the referral link does not exist'
          );
          this.router.navigateByUrl('/auth');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar('User Found');
      });
  }

  onSubmit() {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      phoneNumber,
      couponCode,
    } = this.form.value;
    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password ||
      !phoneNumber ||
      !couponCode
    )
      return null;

    let userPackage = this.userPackage;

    const newUser: NewUser = {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      userPackage,
      password,
    };

    return this.authService
      .checkCouponCode(couponCode)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('The coupon code is not valid');
          return throwError(err);
        }),
        tap(({ userPackage }) => {
          this.userPackage = userPackage;
        }),
        retry(1)
      )
      .subscribe(() => {
        return this.authService
          .register(newUser)
          .pipe(
            catchError((err) => {
              this.errorHandlerService.openSnackBar(
                'Check the values you input in the form'
              );
              return throwError(err);
            })
          )

          .subscribe(() => {
            this.registerWallet();
            this.referralService.referral();
            this.authService
              .updatePackage(userName, this.userPackage)
              .subscribe();
            this.errorHandlerService.openSuccessSnackBar(
              'Registered successfully'
            );
            this.router.navigateByUrl('/auth');
          });
      });
  }

  registerWallet() {
    const { userName, userPackage } = this.form.value;

    const mcfPoints = 0 as unknown as number;
    const referralBalance = 0 as unknown as number;

    const newWallet: NewWallet = {
      userName,
      userPackage,
      mcfPoints: mcfPoints,
      referralBalance: referralBalance,
    };

    return this.authService.registerWallet(newWallet).subscribe();
  }

  private getUsernameFromUrl(): string {
    this.urlUsername = this.route.parent.snapshot.url[1].path;
    return this.route.parent.snapshot.url[1].path;
  }
}
