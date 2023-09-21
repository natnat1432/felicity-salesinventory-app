import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuleatDeliveryadminComponent } from './suleat-deliveryadmin.component';

describe('SuleatDeliveryadminComponent', () => {
  let component: SuleatDeliveryadminComponent;
  let fixture: ComponentFixture<SuleatDeliveryadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuleatDeliveryadminComponent]
    });
    fixture = TestBed.createComponent(SuleatDeliveryadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
