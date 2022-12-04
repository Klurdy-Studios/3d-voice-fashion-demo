import { TestBed } from '@angular/core/testing';

import { ThreedService } from './threed.service';

describe('ThreedService', () => {
  let service: ThreedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
