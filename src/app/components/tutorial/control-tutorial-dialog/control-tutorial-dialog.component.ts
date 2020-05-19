import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog'
@Component({
  selector: 'app-control-tutorial-dialog',
  templateUrl: './control-tutorial-dialog.component.html',
  styleUrls: ['./control-tutorial-dialog.component.scss']
})
export class ControlTutorialDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ControlTutorialDialogComponent>) { }


  ngOnInit(): void {
  }

}
