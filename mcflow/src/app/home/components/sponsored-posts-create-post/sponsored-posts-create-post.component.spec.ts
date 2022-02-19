import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredPostsCreatePostComponent } from './sponsored-posts-create-post.component';

describe('SponsoredPostsCreatePostComponent', () => {
  let component: SponsoredPostsCreatePostComponent;
  let fixture: ComponentFixture<SponsoredPostsCreatePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsoredPostsCreatePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredPostsCreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
