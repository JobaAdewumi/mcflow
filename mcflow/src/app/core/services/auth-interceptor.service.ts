import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return of(localStorage.getItem('token') as string).pipe(
      switchMap((data: string) => {
        // const token = data;
        if (data) {
          const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + data),
          });
          return next.handle(clonedRequest);
        }
        return next.handle(req).pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
              // Client side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // Server-side error
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            window.alert(errorMessage);
            this.openSnackBar(errorMessage);
            return throwError(errorMessage);
          })
        );
      })
    );

    // return next.handle(req).pipe(
    //   retry(1),
    //   catchError((error: HttpErrorResponse) => {
    //     let errorMessage = '';
    //     if (error.error instanceof ErrorEvent) {
    //       // Client side error
    //       errorMessage = `Error: ${error.error.message}`;
    //     } else {
    //       // Server-side error
    //       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    //     }
    //     window.alert(errorMessage);
    //     return this.openSnackBar(errorMessage)
    //   })
    // )
  }

  constructor(private _snackbar: MatSnackBar) {}

  openSnackBar(errorMessage: string) {
    const action: string = 'exit';
    this._snackbar.open(errorMessage, action, {
      duration: 4000,
      horizontalPosition: 'center',
    });
  }
}
