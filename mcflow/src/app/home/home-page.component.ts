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

  constructor(private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.role = role;
      this.user$.next(role as any);
    });
  }

  openCreatePost() {
    this.dialog.open(SponsoredPostsCreatePostComponent, {
      width: '100%',
    });
  }

  openConfirmWithdrawal() {
    this.dialog.open(ConfirmWithdrawalComponent, {
      width: '100%',
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
