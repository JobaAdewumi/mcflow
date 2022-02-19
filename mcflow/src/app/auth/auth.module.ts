import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './auth-page.component';

@NgModule({
  declarations: [AuthPageComponent],
  imports: [CommonModule, AuthRoutingModule, MaterialModule, FormsModule],
})
export class AuthModule { }
