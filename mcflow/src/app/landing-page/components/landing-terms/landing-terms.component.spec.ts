import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTermsComponent } from './landing-terms.component';

describe('LandingTermsComponent', () => {
  let component: LandingTermsComponent;
  let fixture: ComponentFixture<LandingTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
