import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './auth-page.component';
import { NgHelmetModule } from 'ng-helmet';
import { VendorPageComponent } from './components/vendor-page/vendor-page.component';
import { VendorDecideComponent } from './components/vendor-decide/vendor-decide.component';
@NgModule({
  declarations: [AuthPageComponent, VendorPageComponent, VendorDecideComponent],
  imports: [
    NgHelmetModule.forRoot({
      baseTitle: '| Mcflow',
    }),
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    FormsModule,
  ],
})
export class AuthModule {}
