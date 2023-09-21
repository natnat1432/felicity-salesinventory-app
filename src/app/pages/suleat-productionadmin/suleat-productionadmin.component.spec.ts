import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatProductionadminComponent } from './suleat-productionadmin.component';

describe('SuleatProductionadminComponent', () => {
  let component: SuleatProductionadminComponent;
  let fixture: ComponentFixture<SuleatProductionadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatProductionadminComponent]
    });
    fixture = TestBed.createComponent(SuleatProductionadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
