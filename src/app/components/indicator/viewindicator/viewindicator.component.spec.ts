import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewindicatorComponent } from './viewindicator.component';

describe('ViewindicatorComponent', () => {
  let component: ViewindicatorComponent;
  let fixture: ComponentFixture<ViewindicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewindicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewindicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
