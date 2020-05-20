import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneConsoleSettingsComponent } from './drone-console-settings.component';

describe('DroneConsoleSettingsComponent', () => {
  let component: DroneConsoleSettingsComponent;
  let fixture: ComponentFixture<DroneConsoleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneConsoleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneConsoleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
