import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class VendorGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isVendorLoggedIn.pipe(
      take(1),
      switchMap((isVendorLoggedIn: boolean) => {
        if (isVendorLoggedIn) {
          return of(isVendorLoggedIn);
        }
        return this.authService.isVendorTokenInStorage();
      }),
      tap((isVendorLoggedIn: boolean) => {
        if (!isVendorLoggedIn) {
          this.router.navigateByUrl('/auth/vendor');
        }
      })
    );
  }
}
