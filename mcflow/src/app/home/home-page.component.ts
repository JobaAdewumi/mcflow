import { ConfirmWithdrawalComponent } from './components/confirm-withdrawal/confirm-withdrawal.component';
import { SponsoredPostsCreatePostComponent } from './components/sponsored-posts-create-post/sponsored-posts-create-post.component';
import { HomeService } from './services/home.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { User } from '../auth/models/user.model';
import { Wallet } from '../auth/models/wallet.model';
import { AuthService } from '../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  private user$ = new BehaviorSubject<User>(null);

  userName: string;
  userPackage: string;
  lastLogin: Date;
  userId: number;
  points: number;

  timer: string;

  role: string;

  currentRoute: 'Sponsored Posts' | 'Dashboard' | 'Cashout' = 'Sponsored Posts';

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.role = role;
      console.log(role);
      this.user$.next(role as any);
    });

    // this.authService.userName.pipe(take(1)).subscribe((userName: string) => {
    //   this.userName = userName;
    //   this.user$.next(userName as any);
    // });

    // this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
    //   this.userId = userId;
    //   this.user$.next(userId as any);
    // });

    // this.authService
    //   .getUserLastLogin(this.userId)
    //   .pipe(
    //     take(1),
    //     tap(({ lastLogin }) => {
    //       this.lastLogin = lastLogin;
    //     })
    //   )
    //   .subscribe();

    // this.homeService
    //   .getUserWallet(this.userName)
    //   .pipe(
    //     take(1),
    //     tap((wallet: Wallet) => {
    //       this.points = wallet.mcfPoints;
    //       // this.referralBalance = wallet.referralBalance;
    //       // this.balance = wallet.balance;
    //     })
    //   )
    //   .subscribe();

    // this.authService.userPackage
    //   .pipe(take(1))
    //   .subscribe((userPackage: string) => {
    //     this.userPackage = userPackage;
    //     this.user$.next(userPackage as any);
    //   });

    // this.authService.lastLogin.pipe(take(1)).subscribe((lastLogin: Date) => {
    //   this.lastLogin = lastLogin;
    //   this.user$.next(lastLogin as any);
    // });
  }

  // getPoints() {
  //   this.authService.userName.pipe(take(1)).subscribe((userName: string) => {
  //     this.userName = userName;
  //     this.user$.next(userName as any);
  //   });

  //   this.authService
  //     .getUserLastLogin(this.userId)
  //     .pipe(
  //       take(1),
  //       tap(({ lastLogin }) => {
  //         this.lastLogin = lastLogin;
  //       })
  //     )
  //     .subscribe();

  //   this.homeService
  //     .getUserWallet(this.userName)
  //     .pipe(
  //       take(1),
  //       tap((wallet: Wallet) => {
  //         console.log(this.userName);
  //         this.points = wallet.mcfPoints;
  //         // this.referralBalance = wallet.referralBalance;
  //         // this.balance = wallet.balance;
  //         console.log(this.points);
  //       })
  //     )
  //     .subscribe();
  // }

  openCreatePost() {
    this.dialog.open(SponsoredPostsCreatePostComponent, {
      width: '50%',
    });
  }

  openConfirmWithdrawal() {
    this.dialog.open(ConfirmWithdrawalComponent, {
      width: '50%',
    });
  }

  dashboard() {
    this.currentRoute = 'Dashboard';
  }

  cashout() {
    this.currentRoute = 'Cashout';
  }

  posts() {
    this.currentRoute = 'Sponsored Posts';
  }

  onSignOut() {
    this.authService.logout();
  }


}
