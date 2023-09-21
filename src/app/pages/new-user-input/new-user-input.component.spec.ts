import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserInputComponent } from './new-user-input.component';

describe('NewUserInputComponent', () => {
  let component: NewUserInputComponent;
  let fixture: ComponentFixture<NewUserInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewUserInputComponent]
    });
    fixture = TestBed.createComponent(NewUserInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
