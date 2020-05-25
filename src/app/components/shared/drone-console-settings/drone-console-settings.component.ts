import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DroneSettingsService } from 'src/app/services/drone/drone-settings.service';
import { DroneSettings } from 'src/app/models/drone';

@Component({
  selector: 'app-drone-console-settings',
  templateUrl: './drone-console-settings.component.html',
  styleUrls: ['./drone-console-settings.component.scss']
})
export class DroneConsoleSettingsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DroneConsoleSettingsComponent>, @Inject(MAT_DIALOG_DATA) public data: DroneSettings ) { 
  }

  ngOnInit(): void {
  }

}
