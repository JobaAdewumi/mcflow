import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { ErrorHandlerService } from '../core/services/error-handler.service';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.scss'],
})
export class VendorHomeComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  couponCode: string;

  ngOnInit(): void {}

  onSubmit() {
    const { userPackage } = this.form.value;
    if (!userPackage) return null;

    return this.authService
      .generateCouponCode(userPackage)
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
    // alert('Referral link has been copied to your clipboard');
  }
}
