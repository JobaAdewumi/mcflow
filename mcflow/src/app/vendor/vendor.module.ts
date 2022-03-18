import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorHomeComponent } from './vendor-home.component';
import { VendorRoutingModule } from './vendor-routing.module';
import { ClipboardModule } from 'ngx-clipboard';
import { MaterialModule } from '../material.module';
import { NgHelmetModule } from 'ng-helmet';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VendorHomeComponent],
  imports: [
    NgHelmetModule.forRoot({
      baseTitle: '| Mcflow',
    }),
    CommonModule,
    VendorRoutingModule,
    MaterialModule,
    ClipboardModule,
    FormsModule,
  ],
})
export class VendorModule {}
