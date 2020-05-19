import { TestBed } from '@angular/core/testing';

import { ExternalComponentsMonitoringService } from './external-components-monitoring.service';

describe('ExternalComponentsMonitoringService', () => {
  let service: ExternalComponentsMonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalComponentsMonitoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
