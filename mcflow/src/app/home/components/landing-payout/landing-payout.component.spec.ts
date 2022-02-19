import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPayoutComponent } from './landing-payout.component';

describe('LandingPayoutComponent', () => {
  let component: LandingPayoutComponent;
  let fixture: ComponentFixture<LandingPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
