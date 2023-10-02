import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatProductlistComponent } from './suleat-productlist.component';

describe('SuleatProductlistComponent', () => {
  let component: SuleatProductlistComponent;
  let fixture: ComponentFixture<SuleatProductlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatProductlistComponent]
    });
    fixture = TestBed.createComponent(SuleatProductlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
