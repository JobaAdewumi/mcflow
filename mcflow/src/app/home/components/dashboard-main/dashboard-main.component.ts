import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardVendorsModalComponent } from '../dashboard-vendors-modal/dashboard-vendors-modal.component';
import { DashboardEditProfileModalComponent } from '../dashboard-edit-profile-modal/dashboard-edit-profile-modal.component';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../../auth/services/auth.service';
import { catchError, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { User } from '../../../auth/models/user.model';
import { Wallet } from '../../../auth/models/wallet.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

type ValidFileExtension = 'png' | 'jpg';
type ValidMimeType = 'image/png' | 'image/jpeg';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent implements OnInit, OnDestroy {
  form: FormGroup;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private homeService: HomeService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ValidFileExtensions: ValidFileExtension[] = ['png', 'jpg'];
  ValidMimeTypes: ValidMimeType[] = ['image/png', 'image/jpeg'];

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  private user$ = new BehaviorSubject<User>(null);

  userName: string;
  fullName: string;
  userPackage: string;
  points: number;
  referralBalance: number;

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.authService.userName.pipe(take(1)).subscribe((userName: string) => {
      this.userName = userName;
      this.user$.next(userName as any);
    });

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.user$.next(fullName as any);
      });

    this.homeService
      .getUserWallet(this.userName)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          this.points = wallet.mcfPoints;
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

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  openDialog() {
    this.dialog.open(DashboardVendorsModalComponent, {
      width: '100%',
    });
  }

  openEditProfile() {
    this.dialog.open(DashboardEditProfileModalComponent, {
      width: '100%',
    });
  }

  onSignOut() {
    this.authService.logout();
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    this.authService
      .uploadUserImage(formData)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Check your email or password');
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
            'Profile picture updated successfully'
          );
        }
      );

    this.form.reset();
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
