import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringlistnewdetailsComponent } from './monitoringlistnewdetails.component';

describe('MonitoringlistnewdetailsComponent', () => {
  let component: MonitoringlistnewdetailsComponent;
  let fixture: ComponentFixture<MonitoringlistnewdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringlistnewdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringlistnewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
