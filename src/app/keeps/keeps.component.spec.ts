import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepsComponent } from './keeps.component';

describe('KeepsComponent', () => {
  let component: KeepsComponent;
  let fixture: ComponentFixture<KeepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
