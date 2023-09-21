import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatOrderanalyticsComponent } from './suleat-orderanalytics.component';

describe('SuleatOrderanalyticsComponent', () => {
  let component: SuleatOrderanalyticsComponent;
  let fixture: ComponentFixture<SuleatOrderanalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatOrderanalyticsComponent]
    });
    fixture = TestBed.createComponent(SuleatOrderanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
