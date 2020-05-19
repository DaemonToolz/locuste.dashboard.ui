import { TestBed } from '@angular/core/testing';

import { AutopilotDataService } from './autopilot-data.service';

describe('AutopilotDataService', () => {
  let service: AutopilotDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutopilotDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
