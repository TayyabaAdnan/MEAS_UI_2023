import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitpercentagelistComponent } from './visitpercentagelist.component';

describe('VisitpercentagelistComponent', () => {
  let component: VisitpercentagelistComponent;
  let fixture: ComponentFixture<VisitpercentagelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitpercentagelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitpercentagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
