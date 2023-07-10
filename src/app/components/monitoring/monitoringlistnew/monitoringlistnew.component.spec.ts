import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringlistnewComponent } from './monitoringlistnew.component';

describe('MonitoringlistnewComponent', () => {
  let component: MonitoringlistnewComponent;
  let fixture: ComponentFixture<MonitoringlistnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringlistnewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringlistnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
