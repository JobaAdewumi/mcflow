import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLandingComponent } from './all-landing.component';

describe('AllLandingComponent', () => {
  let component: AllLandingComponent;
  let fixture: ComponentFixture<AllLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
