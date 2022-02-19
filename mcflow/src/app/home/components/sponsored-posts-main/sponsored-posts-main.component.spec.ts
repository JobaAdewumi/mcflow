import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredPostsMainComponent } from './sponsored-posts-main.component';

describe('SponsoredPostsMainComponent', () => {
  let component: SponsoredPostsMainComponent;
  let fixture: ComponentFixture<SponsoredPostsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsoredPostsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredPostsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
