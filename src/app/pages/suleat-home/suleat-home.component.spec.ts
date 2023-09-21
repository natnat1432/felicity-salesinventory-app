import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatHomeComponent } from './suleat-home.component';

describe('SuleatHomeComponent', () => {
  let component: SuleatHomeComponent;
  let fixture: ComponentFixture<SuleatHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatHomeComponent]
    });
    fixture = TestBed.createComponent(SuleatHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
