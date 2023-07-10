import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatormasterComponent } from './indicatormaster.component';

describe('IndicatormasterComponent', () => {
  let component: IndicatormasterComponent;
  let fixture: ComponentFixture<IndicatormasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatormasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatormasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
