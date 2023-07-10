import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HfzoneaddComponent } from './hfzoneadd.component';

describe('HfzoneaddComponent', () => {
  let component: HfzoneaddComponent;
  let fixture: ComponentFixture<HfzoneaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HfzoneaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HfzoneaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
