import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { Vendor } from '../../models/vendor.model';
import { Wallet } from '../../models/wallet.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendor-decide',
  templateUrl: './vendor-decide.component.html',
  styleUrls: ['./vendor-decide.component.scss'],
})
export class VendorDecideComponent implements OnInit {
  urlUsername: string;

  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsernameFromUrl();

    this.authService
      .getVendor(this.urlUsername)
      .pipe(
        tap((vendor: Vendor) => {
          this.id = vendor.id;
          this.firstName = vendor.firstName;
          this.lastName = vendor.lastName;
          this.userName = vendor.userName;
          this.phoneNumber = vendor.phoneNumber;
          this.email = vendor.email;
          this.isActive = vendor.isActive;
        }),
        catchError((err) => {
          this.errorHandlerService.openSnackBar(
            'This username is not registered to any vendor'
          );
          this.router.navigateByUrl('/not-found');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar('Vendor Found');
      });
  }

  accept() {
    console.log(
      'hey',
      this.id,
      this.firstName,
      this.lastName,
      this.userName,
      this.phoneNumber,
      this.email,
      this.isActive
    );
    const id: number = this.id;
    const firstName = this.firstName;
    const lastName = this.lastName;
    const userName = this.userName;
    const phoneNumber = this.phoneNumber;
    const email = this.email;
    const isActive = this.isActive;
    // if (
    //   !firstName ||
    //   !lastName ||
    //   !userName ||
    //   !email ||
    //   !isActive ||
    //   !phoneNumber ||
    //   !id
    // )
    //   return null;

    const vendor: Vendor = {
      id,
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      isActive,
    };
    console.log('yo');

    return this.authService
      .acceptVendor(vendor)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Error accepting vendor');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar('Accepted successfully');
        this.router.navigateByUrl('/auth');
      });
  }

  decline() {
    console.log('hey');
    const id: number = this.id;
    const firstName: string = this.firstName;
    const lastName: string = this.lastName;
    const userName: string = this.userName;
    const phoneNumber: string = this.phoneNumber;
    const email: string = this.email;
    const isActive: boolean = this.isActive;
    // if (
    //   !firstName ||
    //   !lastName ||
    //   !userName ||
    //   !email ||
    //   !isActive ||
    //   !phoneNumber ||
    //   !id
    // )
    //   return null;

    const vendor: Vendor = {
      firstName,
      lastName,
      userName,
      email,
      isActive,
      phoneNumber,
      id,
    };
    console.log('yo');

    return this.authService
      .declineVendor(vendor)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Error rejecting vendor');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar('Rejected successfully');
        this.router.navigateByUrl('/auth');
      });
  }

  private getUsernameFromUrl(): string {
    this.urlUsername = this.route.snapshot.url[2].path;
    return this.route.snapshot.url[2].path;
  }
}
