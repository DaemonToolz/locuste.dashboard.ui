import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneStatusDetailComponent } from './drone-status-detail.component';

describe('DroneStatusDetailComponent', () => {
  let component: DroneStatusDetailComponent;
  let fixture: ComponentFixture<DroneStatusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneStatusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
