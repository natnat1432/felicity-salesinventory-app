import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicitySupplierlistComponent } from './felicity-supplierlist.component';

describe('FelicitySupplierlistComponent', () => {
  let component: FelicitySupplierlistComponent;
  let fixture: ComponentFixture<FelicitySupplierlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicitySupplierlistComponent]
    });
    fixture = TestBed.createComponent(FelicitySupplierlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
