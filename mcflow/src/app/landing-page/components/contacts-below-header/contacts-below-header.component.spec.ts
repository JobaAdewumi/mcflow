import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsBelowHeaderComponent } from './contacts-below-header.component';

describe('ContactsBelowHeaderComponent', () => {
  let component: ContactsBelowHeaderComponent;
  let fixture: ComponentFixture<ContactsBelowHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsBelowHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsBelowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
