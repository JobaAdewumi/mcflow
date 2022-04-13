import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NewUser } from '../../models/newUser.model';
import { NewVendor } from '../../models/newVendor.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendor-page',
  templateUrl: './vendor-page.component.html',
  styleUrls: ['./vendor-page.component.scss'],
})
export class VendorPageComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  mcfPoints: number;
  referralBalance: number;
  userName: string;
  userPackage: string;
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
        .loginVendor(email, password)
        .pipe(
          catchError((err) => {
            this.errorHandlerService.openSnackBar(
              'Check your email or password'
            );
            return throwError(err);
          })
        )
        .subscribe(() => {
          this.errorHandlerService.openSuccessSnackBar('Login successful');
          this.router.navigateByUrl('/vendor');
        });
    } else if (this.submissionType === 'join') {
      const { firstName, lastName, userName, phoneNumber } = this.form.value;
      if (!firstName || !lastName) return null;

      const newVendor: NewVendor = {
        firstName,
        lastName,
        userName,
        email,
        phoneNumber,
        password,
      };

      return this.authService
        .registerVendor(newVendor)
        .pipe(
          catchError((err) => {
            this.errorHandlerService.openSnackBar(
              'Check the values you input in the form'
            );
            return throwError(err);
          })
        )
        .subscribe(() => {
          this.errorHandlerService.openSuccessSnackBar('Check your email');
          this.toggleText();
        });
    }
    return null;
  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }
}
