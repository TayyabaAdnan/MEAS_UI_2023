import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserzoneComponent } from './userzone.component';

describe('UserzoneComponent', () => {
  let component: UserzoneComponent;
  let fixture: ComponentFixture<UserzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserzoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
