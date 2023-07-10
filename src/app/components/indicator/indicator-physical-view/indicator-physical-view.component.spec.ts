import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorPhysicalViewComponent } from './indicator-physical-view.component';

describe('IndicatorPhysicalViewComponent', () => {
  let component: IndicatorPhysicalViewComponent;
  let fixture: ComponentFixture<IndicatorPhysicalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorPhysicalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorPhysicalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
