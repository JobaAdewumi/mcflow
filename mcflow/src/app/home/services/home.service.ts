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
  lastSharedLogin: Date;
  userId: number;
  points: number;
  referralB: number;

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

    this.authService
      .getUserLastSharedLogin(this.userId)
      .pipe(
        take(1),
        tap(({ lastSharedLogin }) => {
          console.log('last-login', lastSharedLogin);
          this.lastSharedLogin = lastSharedLogin;
        })
      )
      .subscribe();

    this.getUserWallet(this.userName)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          console.log(this.userName);
          this.points = wallet.mcfPoints;
          this.referralB = wallet.referralBalance;
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

  loginCheckMcf() {
    const rawTime = new Date(this.lastLogin);
    const currentTime = new Date();
    const day = rawTime.getDate();
    const day2 = currentTime.getDate();
    console.log(day, day2);

    if (!this.lastLogin || this.lastLogin == null) {
      this.addLoginDate(this.userId).subscribe();
      console.log('first');
      return null;
    } else if (day >= day2) {
      console.log('second');
      return null;
    } else if (day < day2) {
      console.log('third');
      this.loginMcf();
      this.addLoginDate(this.userId).subscribe();
    }
    return null;
  }

  shareCheckMcf(
    userName: string,
    userPackage: string,
    lastSharedLogin: Date,
    points: number
  ) {
    const rawTime = new Date(this.lastSharedLogin);
    const currentTime = new Date();
    const day = rawTime.getDay();
    const day2 = currentTime.getDay();

    if (!this.lastSharedLogin || this.lastSharedLogin == null) {
      this.addSharedDate(this.userId).subscribe();
      console.log('first');
      return null;
    } else if (day >= day2) {
      console.log('second');
      return null;
    } else if (day < day2) {
      console.log('third');
      this.shareMcf(userName, userPackage, lastSharedLogin, points).subscribe();
      this.addSharedDate(this.userId).subscribe();
    }
    return null;
  }

  startCountdown(seconds: number) {
    let counter = seconds;

    const interval = setInterval(() => {
      console.log(counter);
      counter--;

      if (counter < 0) {
        this.loginCheckMcf();
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

  shareMcf(
    userName: string,
    userPackage: string,
    lastSharedLogin: Date,
    points: number
  ) {
    console.log(
      `${userName}`,
      `${userPackage}`,
      `${lastSharedLogin}`,
      `${points}`
    );
    return this.http.put(
      `${environment.baseApiUrl}/user/share/mcf`,
      { userName, userPackage, lastSharedLogin, points },
      this.httpOptions
    );
  }

  addLoginDate(userId: number) {
    console.log('login date func', userId);
    return this.http.put(`${environment.baseApiUrl}/auth/login/date`, {
      userId,
    });
  }

  addSharedDate(userId: number) {
    console.log('shared date func ser', userId);
    return this.http.put(`${environment.baseApiUrl}/auth/shared/date`, {
      userId,
    });
  }

  checkDeductMcf() {}

  deductMcf(userName: string, points: number) {
    return this.http.put(
      `${environment.baseApiUrl}/wallet/confirm/mcf`,
      { userName, points },
      this.httpOptions
    );
  }

  deductRef(userName: string, referralB: number) {
    return this.http.put(
      `${environment.baseApiUrl}/wallet/confirm/ref`,
      { userName, referralB },
      this.httpOptions
    );
  }
}
