import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityPricelistComponent } from './felicity-pricelist.component';

describe('FelicityPricelistComponent', () => {
  let component: FelicityPricelistComponent;
  let fixture: ComponentFixture<FelicityPricelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityPricelistComponent]
    });
    fixture = TestBed.createComponent(FelicityPricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
