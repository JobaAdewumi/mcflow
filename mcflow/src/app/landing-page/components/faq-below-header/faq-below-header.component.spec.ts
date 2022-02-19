import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqBelowHeaderComponent } from './faq-below-header.component';

describe('FaqBelowHeaderComponent', () => {
  let component: FaqBelowHeaderComponent;
  let fixture: ComponentFixture<FaqBelowHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqBelowHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqBelowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
