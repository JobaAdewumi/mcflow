import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserPackage } from '../../auth/models/package.enum';
import { Wallet } from '../../auth/models/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  constructor(private http: HttpClient) {}

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  userName: string;
  userPackage: string;
  referred: number;
  referralBalance: number;

  getUserWallet(userName: string): Observable<Wallet> {
    return this.http
      .get<Wallet>(`${environment.baseApiUrl}/wallet/referral/${userName}`)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          this.referralBalance = wallet.referralBalance;
          this.userName = wallet.userName;
          this.referred = wallet.referred;
          this.userPackage = wallet.userPackage;
          console.log(this.userPackage);
        })
      );
  }

  referral() {
    return this.referralP(
      this.userName,
      this.userPackage,
      this.referred,
      this.referralBalance
    ).subscribe();
  }

  referralP(userName: string, userPackage: string, ref: number, refB: number) {
    return this.http.put(
      `${environment.baseApiUrl}/user/referral`,
      { userName, userPackage, ref, refB },
      this.httpOptions
    );
  }

  getUserPackage(userName: string): Observable<UserPackage> {
    return this.http
      .get(`${environment.baseApiUrl}/user/package/${userName}`)
      .pipe(
        tap((userPackage: UserPackage) => {
          this.userPackage = userPackage;
          return userPackage;
        })
      );
  }
}
