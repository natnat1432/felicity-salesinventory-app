import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicitySalesadminComponent } from './felicity-salesadmin.component';

describe('FelicitySalesadminComponent', () => {
  let component: FelicitySalesadminComponent;
  let fixture: ComponentFixture<FelicitySalesadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicitySalesadminComponent]
    });
    fixture = TestBed.createComponent(FelicitySalesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
