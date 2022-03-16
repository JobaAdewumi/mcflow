import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { MaterialModule } from '../material.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page.component';

import { FooterComponent } from './components/footer/footer.component';

import { LandingSponsoredPostsComponent } from './components/landing-sponsored-posts/landing-sponsored-posts.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { LandingPayoutComponent } from './components/landing-payout/landing-payout.component';
import { DashboardWalletComponent } from './components/dashboard-wallet/dashboard-wallet.component';
import { PayoutMainComponent } from './components/payout-main/payout-main.component';
import { DashboardVendorsModalComponent } from './components/dashboard-vendors-modal/dashboard-vendors-modal.component';
import { DashboardEditProfileModalComponent } from './components/dashboard-edit-profile-modal/dashboard-edit-profile-modal.component';
import { AuthModule } from '../auth/auth.module';
import { SponsoredPostsMainComponent } from './components/sponsored-posts-main/sponsored-posts-main.component';
import { SponsoredPostsCreatePostComponent } from './components/sponsored-posts-create-post/sponsored-posts-create-post.component';
import { NgHelmetModule } from 'ng-helmet';
import { ConfirmWithdrawalComponent } from './components/confirm-withdrawal/confirm-withdrawal.component';

@NgModule({
  declarations: [
    HomePageComponent,
    LandingSponsoredPostsComponent,
    HeaderComponent,
    FooterComponent,
    LandingDashboardComponent,
    DashboardMainComponent,
    LandingPayoutComponent,
    DashboardWalletComponent,
    PayoutMainComponent,
    DashboardVendorsModalComponent,
    DashboardEditProfileModalComponent,
    SponsoredPostsMainComponent,
    SponsoredPostsCreatePostComponent,
    ConfirmWithdrawalComponent,
  ],
  imports: [
    NgHelmetModule.forRoot({
      baseTitle: '| Mcflow',
    }),
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    ClipboardModule,
    FormsModule,
    AuthModule,
  ],
})
export class HomeModule {}
