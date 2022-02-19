import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelowTermsComponent } from './below-terms.component';

describe('BelowTermsComponent', () => {
  let component: BelowTermsComponent;
  let fixture: ComponentFixture<BelowTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BelowTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BelowTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
