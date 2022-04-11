import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVendorsModalComponent } from './dashboard-vendors-modal.component';

describe('DashboardVendorsModalComponent', () => {
  let component: DashboardVendorsModalComponent;
  let fixture: ComponentFixture<DashboardVendorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardVendorsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardVendorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
