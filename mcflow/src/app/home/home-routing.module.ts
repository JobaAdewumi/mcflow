import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';
import { LandingPayoutComponent } from './components/landing-payout/landing-payout.component';
import { LandingSponsoredPostsComponent } from './components/landing-sponsored-posts/landing-sponsored-posts.component';
import { VendorHomeComponent } from './components/vendor-home/vendor-home.component';
import { HomePageComponent } from './home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      { path: '', component: LandingDashboardComponent },
      { path: 'sponsored', component: LandingSponsoredPostsComponent },
      { path: 'payout', component: LandingPayoutComponent },
      { path: 'vendor', component: VendorHomeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
