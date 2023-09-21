import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorwrongpageComponent } from './errorwrongpage.component';

describe('ErrorwrongpageComponent', () => {
  let component: ErrorwrongpageComponent;
  let fixture: ComponentFixture<ErrorwrongpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorwrongpageComponent]
    });
    fixture = TestBed.createComponent(ErrorwrongpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
