import { AuthService } from 'src/app/auth/services/auth.service';
import { UpdatedUser } from './../../../auth/models/updatedUser.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-dashboard-edit-profile-modal',
  templateUrl: './dashboard-edit-profile-modal.component.html',
  styleUrls: ['./dashboard-edit-profile-modal.component.scss'],
})
export class DashboardEditProfileModalComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  userId$ = new BehaviorSubject<number>(null);

  updatingUserId: number;

  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.updatingUserId = userId;
      this.userId$.next(userId);
    });
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return null;
    const updatedUser: UpdatedUser = {
      email,
      password,
    };

    return this.authService
      .updateUser(this.updatingUserId, updatedUser)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Email has been used already');
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar(
          'Your profile has been successfully updated'
        );
      });
  }
}
