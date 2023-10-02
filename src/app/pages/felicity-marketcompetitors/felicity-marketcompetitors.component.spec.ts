import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FelicityMarketcompetitorsComponent } from './felicity-marketcompetitors.component';

describe('FelicityMarketcompetitorsComponent', () => {
  let component: FelicityMarketcompetitorsComponent;
  let fixture: ComponentFixture<FelicityMarketcompetitorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FelicityMarketcompetitorsComponent]
    });
    fixture = TestBed.createComponent(FelicityMarketcompetitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
