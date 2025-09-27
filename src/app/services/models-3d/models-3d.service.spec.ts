import { TestBed } from '@angular/core/testing';

import { Models3dService } from './models-3d.service';

describe('Models3dService', () => {
  let service: Models3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Models3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
