import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEditProfileModalComponent } from './dashboard-edit-profile-modal.component';

describe('DashboardEditProfileModalComponent', () => {
  let component: DashboardEditProfileModalComponent;
  let fixture: ComponentFixture<DashboardEditProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardEditProfileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
