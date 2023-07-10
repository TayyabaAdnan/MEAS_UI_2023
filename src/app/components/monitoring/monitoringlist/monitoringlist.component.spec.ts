import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringlistComponent } from './monitoringlist.component';

describe('MonitoringlistComponent', () => {
  let component: MonitoringlistComponent;
  let fixture: ComponentFixture<MonitoringlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
