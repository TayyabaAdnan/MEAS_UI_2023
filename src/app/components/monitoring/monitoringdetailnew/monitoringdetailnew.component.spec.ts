import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringdetailnewComponent } from './monitoringdetailnew.component';

describe('MonitoringdetailnewComponent', () => {
  let component: MonitoringdetailnewComponent;
  let fixture: ComponentFixture<MonitoringdetailnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringdetailnewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringdetailnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
