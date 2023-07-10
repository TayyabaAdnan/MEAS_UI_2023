import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorlistComponent } from './indicatorlist.component';

describe('IndicatorlistComponent', () => {
  let component: IndicatorlistComponent;
  let fixture: ComponentFixture<IndicatorlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
