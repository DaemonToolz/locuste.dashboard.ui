import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTutorialDialogComponent } from './control-tutorial-dialog.component';

describe('ControlTutorialDialogComponent', () => {
  let component: ControlTutorialDialogComponent;
  let fixture: ComponentFixture<ControlTutorialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTutorialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTutorialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
