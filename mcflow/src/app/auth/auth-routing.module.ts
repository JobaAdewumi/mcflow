import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthPageComponent } from './auth-page.component';
import { VendorPageComponent } from './components/vendor-page/vendor-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPageComponent,
  },
  // {
  //   path: 'vendor',
  //   component: VendorPageComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
