import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityPricelistviewComponent } from './felicity-pricelistview.component';

describe('FelicityPricelistviewComponent', () => {
  let component: FelicityPricelistviewComponent;
  let fixture: ComponentFixture<FelicityPricelistviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityPricelistviewComponent]
    });
    fixture = TestBed.createComponent(FelicityPricelistviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
