import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreComponent } from '../core.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private _snackbar: MatSnackBar) {}

  title: string = 'An error has occurred';
  error: string = '';

  openSnackBar(errorMessage: string) {
    this.error = errorMessage;
    this._snackbar.openFromComponent(CoreComponent, {
      horizontalPosition: 'center',
      duration: 9000,
      panelClass: ['red-snackbar'],
    });
  }

  openSuccessSnackBar(successMessage: string) {
    const action: string = 'dismiss';
    this._snackbar.open(successMessage, action, {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['green-snackbar'],
    });
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      return of(result as T).pipe(tap(() => this.openSnackBar(error.name)));
    };
  }
}
