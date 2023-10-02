import { TestBed } from '@angular/core/testing';

import { SuleatPricelistService } from './suleat-pricelist.service';

describe('SuleatPricelistService', () => {
  let service: SuleatPricelistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuleatPricelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
