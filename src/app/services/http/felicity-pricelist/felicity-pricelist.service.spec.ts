import { TestBed } from '@angular/core/testing';

import { FelicityPricelistService } from './felicity-pricelist.service';

describe('FelicityPricelistService', () => {
  let service: FelicityPricelistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FelicityPricelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
