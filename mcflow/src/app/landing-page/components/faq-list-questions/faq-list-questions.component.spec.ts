import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqListQuestionsComponent } from './faq-list-questions.component';

describe('FaqListQuestionsComponent', () => {
  let component: FaqListQuestionsComponent;
  let fixture: ComponentFixture<FaqListQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqListQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqListQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
