import { TestBed } from '@angular/core/testing';

import { FelicityProductsService } from './felicity-products.service';

describe('FelicityProductsService', () => {
  let service: FelicityProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FelicityProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
