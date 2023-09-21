import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityDeliveryadminComponent } from './felicity-deliveryadmin.component';

describe('FelicityDeliveryadminComponent', () => {
  let component: FelicityDeliveryadminComponent;
  let fixture: ComponentFixture<FelicityDeliveryadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityDeliveryadminComponent]
    });
    fixture = TestBed.createComponent(FelicityDeliveryadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
