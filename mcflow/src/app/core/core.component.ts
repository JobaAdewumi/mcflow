import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorHandlerService } from './services/error-handler.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
  }
  
  title: string = this.errorHandlerService.title;
  error: string = this.errorHandlerService.error;
  
  openSnackBar(errorMessage: string) {
    this.error = errorMessage;
    this.snackbar.openFromComponent(CoreComponent, {
      horizontalPosition: 'center',
      duration: 4000,
    });
  }

}
