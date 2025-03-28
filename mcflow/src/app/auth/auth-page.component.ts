import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NewUser } from './models/newUser.model';
import { User } from './models/user.model';
import { NewWallet } from './models/newWallet.model';

import { AuthService } from './services/auth.service';

import { HomeService } from '../home/services/home.service';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { ErrorHandlerService } from '../core/services/error-handler.service';
import { throwError } from 'rxjs';
import { UserPackage } from './models/package.enum';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' | 'pending' = 'login';

  mcfPoints: number;
  referralBalance: number;
  userName: string;
  userPackage: UserPackage;
  email: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return null;

    if (this.submissionType === 'login') {
      return this.authService
        .login(email, password)
        .pipe(
          catchError((err) => {
            this.errorHandlerService.openSnackBar(
              'Check your email or password'
            );
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
            this.errorHandlerService.openSuccessSnackBar('Login successful');
            this.router.navigateByUrl('/home');
          }
        );
    } else if (this.submissionType === 'join') {
      const { firstName, lastName, userName, phoneNumber, couponCode } =
        this.form.value;
      if (!firstName || !lastName || !couponCode) return null;

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
            this.errorHandlerService.openSnackBar(
              'The coupon code is not valid'
            );
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
              this.authService
                .updatePackage(userName, this.userPackage)
                .subscribe();
              this.errorHandlerService.openSuccessSnackBar(
                'Registered successfully'
              );
              this.toggleText();
            });
        });
    }
    return null;
  }

  registerWallet() {
    const { userName } = this.form.value;

    let userPackage = this.userPackage;

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

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }
}
