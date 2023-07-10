import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneaddComponent } from './zoneadd.component';

describe('ZoneaddComponent', () => {
  let component: ZoneaddComponent;
  let fixture: ComponentFixture<ZoneaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
