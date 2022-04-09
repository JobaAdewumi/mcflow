import { Vendor } from './../../../../../api/src/auth/models/vendor.class';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { environment } from './../../../environments/environment';

import { NewUser } from './../models/newUser.model';
import { User } from '../models/user.model';
import { userResponse } from '../models/userResponse.model';
import { UserPackage } from '../models/package.enum';
import { Wallet } from '../models/wallet.model';
import { NewWallet } from '../models/newWallet.model';
import { UpdatedUser } from '../models/updatedUser.model';
import { Role } from '../models/role.enum';
import { NewVendor } from '../models/newVendor.model';
import { vendorResponse } from '../models/vendorResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);
  private vendor$ = new BehaviorSubject<Vendor>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get isVendorLoggedIn(): Observable<boolean> {
    return this.vendor$.asObservable().pipe(
      switchMap((vendor: Vendor) => {
        const isVendorAuthenticated = vendor !== null;
        return of(isVendorAuthenticated);
      })
    );
  }

  get userPackage(): Observable<UserPackage> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.userPackage);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.role);
      })
    );
  }

  get userReferralLink(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.referralLink);
      })
    );
  }

  get lastLogin(): Observable<Date> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.lastLogin);
      })
    );
  }

  get lastSharedLogin(): Observable<Date> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.lastSharedLogin);
      })
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.id);
      })
    );
  }

  get userName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.userName);
      })
    );
  }

  get email(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.email);
      })
    );
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const fullName = user.firstName + ' ' + user.lastName;
        return of(fullName);
      })
    );
  }

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHaveImage = !!user?.imagePath;
        let fullImagePath = this.getDefaultFullImagePath();
        if (doesAuthorHaveImage) {
          fullImagePath = this.getFullImagePath(user.imagePath);
        }
        return of(fullImagePath);
      })
    );
  }

  constructor(private http: HttpClient, private router: Router) {}

  getDefaultFullImagePath(): string {
    return 'http://localhost:3000/api/user/image/blank-profile-picture.png';
  }

  getFullImagePath(imageName: string): string {
    return 'http://localhost:3000/api/user/image/' + imageName;
  }

  getUserImage() {
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(
        `${environment.baseApiUrl}/user/images/image-name`
      )
      .pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    );
  }

  uploadUserImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/user/upload`,
        formData
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          user.imagePath = modifiedFileName;
          this.user$.next(user);
        })
      );
  }

  getUserLastLogin(id: number): Observable<{ lastLogin: Date | null }> {
    return this.http
      .get<{ lastLogin: Date }>(
        `${environment.baseApiUrl}/user/last-login/${id}`
      )
      .pipe(take(1));
  }

  getUserLastSharedLogin(
    id: number
  ): Observable<{ lastSharedLogin: Date | null }> {
    return this.http
      .get<{ lastSharedLogin: Date }>(
        `${environment.baseApiUrl}/user/last-shared-login/${id}`
      )
      .pipe(take(1));
  }

  getUserWallet(userName: string): Observable<Wallet> {
    return this.http
      .get<Wallet>(`${environment.baseApiUrl}/wallet/${userName}`)
      .pipe(take(1));
  }

  register(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(take(1));
  }

  registerWallet(newWallet: NewWallet): Observable<Wallet> {
    return this.http
      .post<Wallet>(
        `${environment.baseApiUrl}/auth/register/wallet`,
        newWallet,
        this.httpOptions
      )
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token);
          const decodedToken: userResponse = jwt_decode(response.token);
          this.user$.next(decodedToken.user);
        })
      );
  }

  updateUser(userId: number, updatedUser: UpdatedUser) {
    return this.http
      .put(
        `${environment.baseApiUrl}/user/${userId}`,
        updatedUser,
        this.httpOptions
      )
      .pipe(take(1));
  }

  isTokenInStorage(): Observable<boolean> {
    return of(localStorage.getItem('token') as string).pipe(
      map((data: string) => {
        if (!data) return null;

        const decodedToken: userResponse = jwt_decode(data);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
        }
        return true;
      })
    );
  }
  isVendorTokenInStorage(): Observable<boolean> {
    return of(localStorage.getItem('token') as string).pipe(
      map((data: string) => {
        if (!data) return null;

        const decodedToken: vendorResponse = jwt_decode(data);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;
        if (decodedToken.vendor) {
          this.vendor$.next(decodedToken.vendor);
        }
        return true;
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/landing');
  }

  logoutVendor(): void {
    this.user$.next(null);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/landing');
  }

  registerVendor(newVendor: NewVendor): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseApiUrl}/auth/register/vendor`,
        newVendor,
        this.httpOptions
      )
      .pipe(take(1));
  }

  loginVendor(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login/vendor`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token);
          const decodedToken: vendorResponse = jwt_decode(response.token);
          this.vendor$.next(decodedToken.vendor);
        })
      );
  }

  generateCouponCode(userPackage: string): Observable<{ couponCode: string }> {
    return this.http
      .post<{ couponCode: string }>(
        `${environment.baseApiUrl}/auth/coupon/generate`,
        { userPackage },
        this.httpOptions
      )
      .pipe(take(1));
  }

  checkCouponCode(
    couponCode: string
  ): Observable<{ userPackage: UserPackage }> {
    return this.http
      .post<{ userPackage: UserPackage }>(
        `${environment.baseApiUrl}/auth/coupon/check`,
        { couponCode },
        this.httpOptions
      )
      .pipe(take(1));
  }

  updatePackage(userName: string, userPackage: string) {
    return this.http
      .put(
        `${environment.baseApiUrl}/user/package/${userName}`,
        { userPackage },
        this.httpOptions
      )
      .pipe(take(1));
  }
}
