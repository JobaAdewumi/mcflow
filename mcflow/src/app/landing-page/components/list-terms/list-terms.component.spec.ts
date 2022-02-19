import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTermsComponent } from './list-terms.component';

describe('ListTermsComponent', () => {
  let component: ListTermsComponent;
  let fixture: ComponentFixture<ListTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
