import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllLandingComponent } from './components/all-landing/all-landing.component';
import { LandingContactsComponent } from './components/landing-contacts/landing-contacts.component';
import { LandingFaqComponent } from './components/landing-faq/landing-faq.component';
import { LandingPrivacyPolicyComponent } from './components/landing-privacy-policy/landing-privacy-policy.component';
import { LandingTermsComponent } from './components/landing-terms/landing-terms.component';
import { LandingPageComponent } from './landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: '', component: AllLandingComponent },
      { path: 'faq', component: LandingFaqComponent },
      { path: 'contacts', component: LandingContactsComponent },
      { path: 'privacy-policy', component: LandingPrivacyPolicyComponent },
      { path: 'terms-and-conditions', component: LandingTermsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
