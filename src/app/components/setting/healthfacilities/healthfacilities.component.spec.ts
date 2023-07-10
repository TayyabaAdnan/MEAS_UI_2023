import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthfacilitiesComponent } from './healthfacilities.component';

describe('HealthfacilitiesComponent', () => {
  let component: HealthfacilitiesComponent;
  let fixture: ComponentFixture<HealthfacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthfacilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthfacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
