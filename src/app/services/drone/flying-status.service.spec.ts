import { TestBed } from '@angular/core/testing';

import { FlyingStatusService } from './flying-status.service';

describe('FlyingStatusService', () => {
  let service: FlyingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlyingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
