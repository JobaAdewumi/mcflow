import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelowHeaderComponent } from './below-header.component';

describe('BelowHeaderComponent', () => {
  let component: BelowHeaderComponent;
  let fixture: ComponentFixture<BelowHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BelowHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BelowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
