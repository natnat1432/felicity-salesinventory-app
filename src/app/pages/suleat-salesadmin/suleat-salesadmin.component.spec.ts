import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatSalesadminComponent } from './suleat-salesadmin.component';

describe('SuleatSalesadminComponent', () => {
  let component: SuleatSalesadminComponent;
  let fixture: ComponentFixture<SuleatSalesadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatSalesadminComponent]
    });
    fixture = TestBed.createComponent(SuleatSalesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
