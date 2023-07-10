import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignvisitsComponent } from './assignvisits.component';

describe('AssignvisitsComponent', () => {
  let component: AssignvisitsComponent;
  let fixture: ComponentFixture<AssignvisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignvisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignvisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
