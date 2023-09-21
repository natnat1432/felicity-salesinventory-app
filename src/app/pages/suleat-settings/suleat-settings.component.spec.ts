import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatSettingsComponent } from './suleat-settings.component';

describe('SuleatSettingsComponent', () => {
  let component: SuleatSettingsComponent;
  let fixture: ComponentFixture<SuleatSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatSettingsComponent]
    });
    fixture = TestBed.createComponent(SuleatSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
