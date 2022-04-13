import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDecideComponent } from './vendor-decide.component';

describe('VendorDecideComponent', () => {
  let component: VendorDecideComponent;
  let fixture: ComponentFixture<VendorDecideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorDecideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDecideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
