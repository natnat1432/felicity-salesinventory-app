import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityOrderanalyticsComponent } from './felicity-orderanalytics.component';

describe('FelicityOrderanalyticsComponent', () => {
  let component: FelicityOrderanalyticsComponent;
  let fixture: ComponentFixture<FelicityOrderanalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityOrderanalyticsComponent]
    });
    fixture = TestBed.createComponent(FelicityOrderanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
