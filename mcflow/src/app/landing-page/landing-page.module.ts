import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BelowHeaderComponent } from './components/below-header/below-header.component';
import { OverviewComponent } from './components/overview/overview.component';
import { CoreValuesComponent } from './components/core-values/core-values.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { PackagesComponent } from './components/packages/packages.component';
import { FooterComponent } from './components/footer/footer.component';
import { AllLandingComponent } from './components/all-landing/all-landing.component';
import { LandingPageComponent } from './landing-page.component';
import { LandingFaqComponent } from './components/landing-faq/landing-faq.component';
import { LandingContactsComponent } from './components/landing-contacts/landing-contacts.component';
import { MaterialModule } from '../material.module';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { FaqBelowHeaderComponent } from './components/faq-below-header/faq-below-header.component';
import { FaqListQuestionsComponent } from './components/faq-list-questions/faq-list-questions.component';
import { ContactsBelowHeaderComponent } from './components/contacts-below-header/contacts-below-header.component';
import { ContactsOverviewComponent } from './components/contacts-overview/contacts-overview.component';
import { ContactsHelpComponent } from './components/contacts-help/contacts-help.component';
import { LandingPrivacyPolicyComponent } from './components/landing-privacy-policy/landing-privacy-policy.component';
import { BelowPrivacyPolicyComponent } from './components/below-privacy-policy/below-privacy-policy.component';
import { ListPrivacyPolicyComponent } from './components/list-privacy-policy/list-privacy-policy.component';
import { LandingTermsComponent } from './components/landing-terms/landing-terms.component';
import { BelowTermsComponent } from './components/below-terms/below-terms.component';
import { ListTermsComponent } from './components/list-terms/list-terms.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FormsModule } from '@angular/forms';
import { NgHelmetModule } from 'ng-helmet';
import { DashboardVendorsModalComponent } from './components/dashboard-vendors-modal/dashboard-vendors-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    BelowHeaderComponent,
    OverviewComponent,
    CoreValuesComponent,
    HowItWorksComponent,
    PackagesComponent,
    FooterComponent,
    AllLandingComponent,
    LandingPageComponent,
    LandingFaqComponent,
    LandingContactsComponent,
    FaqBelowHeaderComponent,
    FaqListQuestionsComponent,
    ContactsBelowHeaderComponent,
    ContactsOverviewComponent,
    ContactsHelpComponent,
    LandingPrivacyPolicyComponent,
    BelowPrivacyPolicyComponent,
    ListPrivacyPolicyComponent,
    LandingTermsComponent,
    BelowTermsComponent,
    ListTermsComponent,
    SidenavComponent,
    DashboardVendorsModalComponent,
  ],
  imports: [
    NgHelmetModule.forRoot({
      baseTitle: '| Mcflow',
    }),
    CommonModule,
    MaterialModule,
    FormsModule,
    LandingPageRoutingModule,
  ],
})
export class LandingPageModule {}
