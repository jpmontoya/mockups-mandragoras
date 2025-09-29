import { TestBed } from '@angular/core/testing';

import { ImagesPrintingService } from './images-printing.service';

describe('ImagesPrintingService', () => {
  let service: ImagesPrintingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesPrintingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
