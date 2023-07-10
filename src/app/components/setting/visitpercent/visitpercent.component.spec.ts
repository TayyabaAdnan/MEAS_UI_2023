import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitpercentComponent } from './visitpercent.component';

describe('VisitpercentComponent', () => {
  let component: VisitpercentComponent;
  let fixture: ComponentFixture<VisitpercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitpercentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitpercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
