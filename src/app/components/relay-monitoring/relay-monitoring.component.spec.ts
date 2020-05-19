import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelayMonitoringComponent } from './relay-monitoring.component';

describe('RelayMonitoringComponent', () => {
  let component: RelayMonitoringComponent;
  let fixture: ComponentFixture<RelayMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelayMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelayMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
