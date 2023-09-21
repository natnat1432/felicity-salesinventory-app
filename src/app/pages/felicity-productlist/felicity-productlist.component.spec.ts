import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityProductlistComponent } from './felicity-productlist.component';

describe('FelicityProductlistComponent', () => {
  let component: FelicityProductlistComponent;
  let fixture: ComponentFixture<FelicityProductlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityProductlistComponent]
    });
    fixture = TestBed.createComponent(FelicityProductlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
