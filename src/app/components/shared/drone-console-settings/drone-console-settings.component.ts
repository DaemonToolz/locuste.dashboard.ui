import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-drone-console-settings',
  templateUrl: './drone-console-settings.component.html',
  styleUrls: ['./drone-console-settings.component.scss']
})
export class DroneConsoleSettingsComponent implements OnInit {

  public verticalSpeed = 0.2
  public horizontalSpeed = 0.2
  public cameraSpeed = 0.2
  
  
  public maxTilt = 15
  public maxRotationSpeed = 0.01

  constructor(public dialogRef: MatDialogRef<DroneConsoleSettingsComponent>) { }

  ngOnInit(): void {
  }

}
