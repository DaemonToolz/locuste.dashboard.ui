import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HelpMeService } from 'src/app/services/users/help-me.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { HelpMeModel } from 'src/app/models/help';

@Component({
  selector: 'app-help-me',
  templateUrl: './help-me.component.html',
  styleUrls: ['./help-me.component.scss']
})
export class HelpMeComponent implements AfterViewInit {
  @ViewChild('helpGroup') helpGroup;

  public displayedColumns: string[] = ['content', 'description', 'comment'];

  constructor(public dialogRef: MatDialogRef<HelpMeComponent>, private helpService: HelpMeService) { 

  }

  public get helpPage(): HelpMeModel[]{
    return this.helpService.currentPage;
  }

  ngAfterViewInit(): void {
    this.helpService.loadDesiredSection(this.helpGroup.selectedIndex)
  }
  

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.helpService.loadDesiredSection(tabChangeEvent.index)
  }
}
