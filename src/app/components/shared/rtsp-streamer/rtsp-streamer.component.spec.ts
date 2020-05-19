import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtspStreamerComponent } from './rtsp-streamer.component';

describe('RtspStreamerComponent', () => {
  let component: RtspStreamerComponent;
  let fixture: ComponentFixture<RtspStreamerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtspStreamerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtspStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
