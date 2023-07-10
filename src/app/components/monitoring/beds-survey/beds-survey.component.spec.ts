import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedsSurveyComponent } from './beds-survey.component';

describe('BedsSurveyComponent', () => {
  let component: BedsSurveyComponent;
  let fixture: ComponentFixture<BedsSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BedsSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BedsSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
