import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-drone-console-settings',
  templateUrl: './drone-console-settings.component.html',
  styleUrls: ['./drone-console-settings.component.scss']
})
export class DroneConsoleSettingsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DroneConsoleSettingsComponent>) { }

  ngOnInit(): void {
  }

}
