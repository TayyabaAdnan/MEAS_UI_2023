import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatornewComponent } from './indicatornew.component';

describe('IndicatornewComponent', () => {
  let component: IndicatornewComponent;
  let fixture: ComponentFixture<IndicatornewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatornewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatornewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
