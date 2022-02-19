import { ErrorHandlerService } from './../../../core/services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { User } from '../../../auth/models/user.model';
import { Wallet } from '../../../auth/models/wallet.model';
import { AuthService } from '../../../auth/services/auth.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-dashboard-wallet',
  templateUrl: './dashboard-wallet.component.html',
  styleUrls: ['./dashboard-wallet.component.scss'],
})
export class DashboardWalletComponent implements OnInit {
  private user$ = new BehaviorSubject<User>(null);

  referralBalance: number;
  balance: number;
  userName: string;
  points: number;

  constructor(
    private clipboardService: ClipboardService,
    private homeService: HomeService,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

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
          this.points = wallet.mcfPoints;
          this.referralBalance = wallet.referralBalance;
          this.balance = wallet.balance;
        })
      )
      .subscribe();
  }

  copyLink() {
    this.errorHandlerService.openSuccessSnackBar('Referral link has been copied successfully');
    // alert('Referral link has been copied to your clipboard');
  }
}
