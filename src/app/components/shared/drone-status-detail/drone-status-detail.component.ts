import { Component, OnInit, Input } from '@angular/core';
import { DroneDataService } from 'src/app/services/drone/drone-data.service';
import { InternalStatuses } from 'src/app/models/drone';

@Component({
  selector: 'app-drone-status-detail',
  templateUrl: './drone-status-detail.component.html',
  styleUrls: ['./drone-status-detail.component.scss']
})
export class DroneStatusDetailComponent implements OnInit {
  @Input() public width: number
  @Input() public height: number
  @Input() public drone: string

  public InternalStatuses = InternalStatuses
  constructor(private droneData :DroneDataService) { }

  ngOnInit(): void {
  }

  public get details(){
    return this.droneData.droneInternalStatus(this.drone) 
  }

  public getKeys(map: any){
    return Array.from(map.keys());
}

}
