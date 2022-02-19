import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPrivacyPolicyComponent } from './landing-privacy-policy.component';

describe('LandingPrivacyPolicyComponent', () => {
  let component: LandingPrivacyPolicyComponent;
  let fixture: ComponentFixture<LandingPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPrivacyPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
