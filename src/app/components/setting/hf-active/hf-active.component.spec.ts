import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HfActiveComponent } from './hf-active.component';

describe('HfActiveComponent', () => {
  let component: HfActiveComponent;
  let fixture: ComponentFixture<HfActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HfActiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HfActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
