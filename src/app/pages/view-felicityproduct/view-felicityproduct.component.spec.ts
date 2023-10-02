import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFelicityproductComponent } from './view-felicityproduct.component';

describe('ViewFelicityproductComponent', () => {
  let component: ViewFelicityproductComponent;
  let fixture: ComponentFixture<ViewFelicityproductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFelicityproductComponent]
    });
    fixture = TestBed.createComponent(ViewFelicityproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
