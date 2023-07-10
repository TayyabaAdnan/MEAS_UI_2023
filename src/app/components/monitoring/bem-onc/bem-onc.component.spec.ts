import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BemOncComponent } from './bem-onc.component';

describe('BemOncComponent', () => {
  let component: BemOncComponent;
  let fixture: ComponentFixture<BemOncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BemOncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BemOncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
