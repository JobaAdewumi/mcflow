import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

import { NewWithdrawal } from '../models/withdrawal.model';
import { Wallet } from '../../auth/models/wallet.model';
import { User } from '../../auth/models/user.model';

import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  userName: string;
  userPackage: string;
  lastLogin: Date;
  userId: number;
  points: number;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService
  ) {
    this.authService
      .getUserImageName()
      .pipe(
        take(1),
        tap(({ imageName }) => {
          const defaultImagePath = 'blank-profile-picture.png';

          this.authService
            .updateUserImagePath(imageName || defaultImagePath)
            .subscribe();
        })
      )
      .subscribe();

    this.authService.userPackage
      .pipe(take(1))
      .subscribe((userPackage: string) => {
        this.userPackage = userPackage;
        this.user$.next(userPackage as any);
      });

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId = userId;
      this.user$.next(userId as any);
    });

    this.authService.userName.pipe(take(1)).subscribe((userName: string) => {
      this.userName = userName;
      this.user$.next(userName as any);
    });

    this.authService
      .getUserLastLogin(this.userId)
      .pipe(
        take(1),
        tap(({ lastLogin }) => {
          console.log('last-login', lastLogin);
          this.lastLogin = lastLogin;
        })
      )
      .subscribe();

    this.getUserWallet(this.userName)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          console.log(this.userName);
          this.points = wallet.mcfPoints;
          // this.referralBalance = wallet.referralBalance;
          console.log(this.points);
        })
      )
      .subscribe();

    this.startCountdown(10);
  }

  loginMcf() {
    console.log('going', this.lastLogin);
    return this.serLoginMcf(
      this.userName,
      this.userPackage,
      this.lastLogin,
      this.points
    ).subscribe();
  }

  startCountdown(seconds: number) {
    let counter = seconds;

    const interval = setInterval(() => {
      console.log(counter);
      counter--;

      if (counter < 0) {
        this.loginMcf();
        clearInterval(interval);
        console.log('Ding!');
      }
    }, 1000);
  }

  getUserWallet(userName: string): Observable<Wallet> {
    return this.http
      .get<Wallet>(`${environment.baseApiUrl}/wallet/${userName}`)
      .pipe(take(1));
  }

  getUser(email: string): Observable<User> {
    return this.http
      .get<User>(`${environment.baseApiUrl}/user/login/${email}`)
      .pipe(
        take(1)
        // tap((user: User) => {
        //   if (!user) throw new Error(`User cannot be found`);
        // }),
        // catchError(this.errorHandlerService.handleError<User>('getUser')),
      );
  }

  sendWithdrawal(newWithdrawal: NewWithdrawal) {
    return this.http.post(
      `${environment.baseApiUrl}/wallet/withdrawal`,
      newWithdrawal,
      this.httpOptions
    );
  }

  serLoginMcf(
    userName: string,
    userPackage: string,
    lastLogin: Date,
    points: number
  ) {
    console.log(`${userName}`, `${userPackage}`, `${lastLogin}`, `${points}`);
    return this.http.put(
      `${environment.baseApiUrl}/user/login/mcf`,
      { userName, userPackage, lastLogin, points },
      this.httpOptions
    );
  }
}
