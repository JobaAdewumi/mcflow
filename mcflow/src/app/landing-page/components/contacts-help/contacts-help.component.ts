import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorHandlerService } from '../../../core/services/error-handler.service';

import { ContactUs } from '../../models/contact-us.model';

import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'app-contacts-help',
  templateUrl: './contacts-help.component.html',
  styleUrls: ['./contacts-help.component.scss'],
})
export class ContactsHelpComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  constructor(
    private landingService: LandingService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const { name, email, phoneNumber, message } = this.form.value;
    if (!name || !email || !phoneNumber || !message) return null;

    const contactUs: ContactUs = {
      name,
      email,
      phoneNumber,
      message,
    };

    return this.landingService
      .sendContactUs(contactUs)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar(
            'An error occurred please try again later.'
          );
          console.log('error:', err);
          return throwError(err);
        })
      )
      .subscribe(
        // res =>
        //   this.errorHandlerService.openSuccessSnackBar(`Login res successfully: ${res}`),
        // err =>
        //   this.errorHandlerService.handleError(
        //     `wrong email or password: ${err}`,

        //   ),

        () => {
          this.errorHandlerService.openSuccessSnackBar('Form sent successfully');
        }
      );
  }
}
