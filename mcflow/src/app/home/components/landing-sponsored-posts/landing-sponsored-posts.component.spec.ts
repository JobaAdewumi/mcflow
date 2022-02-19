import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingSponsoredPostsComponent } from './landing-sponsored-posts.component';

describe('LandingSponsoredPostsComponent', () => {
  let component: LandingSponsoredPostsComponent;
  let fixture: ComponentFixture<LandingSponsoredPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingSponsoredPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingSponsoredPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
