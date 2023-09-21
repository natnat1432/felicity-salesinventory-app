import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityProductionadminComponent } from './felicity-productionadmin.component';

describe('FelicityProductionadminComponent', () => {
  let component: FelicityProductionadminComponent;
  let fixture: ComponentFixture<FelicityProductionadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityProductionadminComponent]
    });
    fixture = TestBed.createComponent(FelicityProductionadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
