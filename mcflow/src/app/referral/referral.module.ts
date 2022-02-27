import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralComponent } from './referral.component';
import { ReferralRoutingModule } from './referral-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { NgHelmetModule } from 'ng-helmet';

@NgModule({
  declarations: [ReferralComponent],
  imports: [
    NgHelmetModule.forRoot({
      baseTitle: '| Mcflow',
    }),
    CommonModule,
    ReferralRoutingModule,
    MaterialModule,
    FormsModule,
  ],
})
export class ReferralModule {}
