import { TestBed } from '@angular/core/testing';

import { SuleatProductsService } from './suleat-products.service';

describe('SuleatProductsService', () => {
  let service: SuleatProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuleatProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
