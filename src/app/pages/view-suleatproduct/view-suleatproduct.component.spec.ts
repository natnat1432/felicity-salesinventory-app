import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuleatproductComponent } from './view-suleatproduct.component';

describe('ViewSuleatproductComponent', () => {
  let component: ViewSuleatproductComponent;
  let fixture: ComponentFixture<ViewSuleatproductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSuleatproductComponent]
    });
    fixture = TestBed.createComponent(ViewSuleatproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
