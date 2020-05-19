import { TestBed } from '@angular/core/testing';

import { ManualCommandRequestService } from './manual-command-request.service';

describe('ManualCommandRequestService', () => {
  let service: ManualCommandRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualCommandRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
