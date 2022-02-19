import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsHelpComponent } from './contacts-help.component';

describe('ContactsHelpComponent', () => {
  let component: ContactsHelpComponent;
  let fixture: ComponentFixture<ContactsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
