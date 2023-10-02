import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatPricelistviewComponent } from './suleat-pricelistview.component';

describe('SuleatPricelistviewComponent', () => {
  let component: SuleatPricelistviewComponent;
  let fixture: ComponentFixture<SuleatPricelistviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatPricelistviewComponent]
    });
    fixture = TestBed.createComponent(SuleatPricelistviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
