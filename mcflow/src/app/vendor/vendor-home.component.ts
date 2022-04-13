import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Vendor } from '../auth/models/vendor.model';
import { AuthService } from '../auth/services/auth.service';
import { ErrorHandlerService } from '../core/services/error-handler.service';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.scss'],
})
export class VendorHomeComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  private vendor$ = new BehaviorSubject<Vendor>(null);

  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  couponCode: string;
  userName: string;
  phoneNumber: string;
  email: string;

  ngOnInit(): void {
    this.userName = this.authService.venUserName;
    console.log(
      '🚀 ~ file: vendor-home.component.ts ~ line 30 ~ VendorHomeComponent ~ ngOnInit ~ userName',
      this.userName
    );
    this.phoneNumber = this.authService.venPhoneNumber;
    console.log(
      '🚀 ~ file: vendor-home.component.ts ~ line 32 ~ VendorHomeComponent ~ ngOnInit ~ phoneNumber',
      this.phoneNumber
    );
    this.email = this.authService.venEmail;
    console.log(
      '🚀 ~ file: vendor-home.component.ts ~ line 34 ~ VendorHomeComponent ~ ngOnInit ~ email',
      this.email
    );
    console.log('vendor', this.vendor$);
  }

  onSubmit() {
    const { userPackage } = this.form.value;
    if (!userPackage) return null;

    return this.authService
      .generateCouponCode(
        this.email,
        this.userName,
        this.phoneNumber,
        userPackage
      )
      .pipe(
        tap(({ couponCode }) => {
          this.couponCode = couponCode;
          alert(couponCode);
        }),

        catchError((err) => {
          this.errorHandlerService.openSnackBar(
            'Coupon Code could not be generated'
          );
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar(
          'Coupon Code generated Successfully'
        );
      });
  }

  copyLink() {
    this.errorHandlerService.openSuccessSnackBar(
      'Referral link has been copied successfully'
    );
  }
}
