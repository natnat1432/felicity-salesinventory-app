import { TestBed } from '@angular/core/testing';

import { MarketcompetitorsService } from './marketcompetitors.service';

describe('MarketcompetitorsService', () => {
  let service: MarketcompetitorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketcompetitorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
