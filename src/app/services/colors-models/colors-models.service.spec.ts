import { TestBed } from '@angular/core/testing';

import { ColorsModelsService } from './colors-models.service';

describe('ColorsModelsService', () => {
  let service: ColorsModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorsModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
