import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrivacyPolicyComponent } from './list-privacy-policy.component';

describe('ListPrivacyPolicyComponent', () => {
  let component: ListPrivacyPolicyComponent;
  let fixture: ComponentFixture<ListPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPrivacyPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
