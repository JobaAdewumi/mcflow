import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { Wallet } from '../../../auth/models/wallet.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { HomeService } from '../../services/home.service';
@Component({
  selector: 'app-confirm-withdrawal',
  templateUrl: './confirm-withdrawal.component.html',
  styleUrls: ['./confirm-withdrawal.component.scss'],
})
export class ConfirmWithdrawalComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  @Input() postId?: number;

  mode: 'mcf' | 'ref' = 'mcf';

  userName: string;
  points: number;
  referralB: number;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {}

  wallet(userName: string) {
    return this.homeService
      .getUserWallet(userName)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          this.points = wallet.mcfPoints;
          this.referralB = wallet.referralBalance;
        })
      )
      .subscribe();
  }

  onSubmit() {
    const { userName, points } = this.form.value;
    if (!userName) return null;
    // this.wallet(userName);
    this.homeService
      .getUserWallet(userName)
      .pipe(
        take(1),
        tap((wallet: Wallet) => {
          this.points = wallet.mcfPoints;
          this.referralB = wallet.referralBalance;
        })
      )
      .subscribe(() => {
        if (this.mode === 'mcf') {
          if (!userName || !points) return null;
          if (points < this.points) {
            this.points = this.points - points;
            return this.homeService
              .deductMcf(userName, this.points)
              .pipe(
                catchError((err) => {
                  this.errorHandlerService.openSnackBar(
                    'mcf could not be created'
                  );
                  return throwError(err);
                })
              )
              .subscribe(() => {
                this.errorHandlerService.openSuccessSnackBar(
                  'mcf created successfully'
                );
              });
          }
        } else if (this.mode === 'ref') {
          const { userName, referralB } = this.form.value;
          if (!userName || !referralB) return null;
          if (referralB < this.referralB) {
            this.referralB = this.referralB - referralB;
            return this.homeService
              .deductRef(userName, this.referralB)
              .pipe(
                catchError((err) => {
                  this.errorHandlerService.openSnackBar(
                    'ref could not be created'
                  );
                  return throwError(err);
                })
              )
              .subscribe(() => {
                this.errorHandlerService.openSuccessSnackBar(
                  'ref created successfully'
                );
              });
          }
        }
        return null;
      });
  }

  toggleText() {
    if (this.mode === 'mcf') {
      this.mode = 'ref';
    } else if (this.mode === 'ref') {
      this.mode = 'mcf';
    }
  }
}
