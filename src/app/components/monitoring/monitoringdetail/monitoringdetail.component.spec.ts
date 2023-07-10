import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringdetailComponent } from './monitoringdetail.component';

describe('MonitoringdetailComponent', () => {
  let component: MonitoringdetailComponent;
  let fixture: ComponentFixture<MonitoringdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
