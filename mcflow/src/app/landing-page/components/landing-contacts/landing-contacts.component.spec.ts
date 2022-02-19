import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingContactsComponent } from './landing-contacts.component';

describe('LandingContactsComponent', () => {
  let component: LandingContactsComponent;
  let fixture: ComponentFixture<LandingContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
