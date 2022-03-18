import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorHomeComponent } from './vendor-home.component';

const routes: Routes = [
  {
    path: '',
    component: VendorHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
