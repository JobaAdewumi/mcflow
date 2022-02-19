import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutMainComponent } from './payout-main.component';

describe('PayoutMainComponent', () => {
  let component: PayoutMainComponent;
  let fixture: ComponentFixture<PayoutMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
