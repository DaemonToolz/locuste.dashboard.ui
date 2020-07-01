import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { SocketStatus, PcToHubStatus, HubToAutomatonStatus, HubStatus, AutomatonStatus } from 'src/app/models/status';
import { DroneDataService } from 'src/app/services/drone/drone-data.service';
import { PingService } from 'src/app/services/ping/ping.service';

import { DroneConnectionStatus } from 'src/app/models/notifications';
import { SubSystem, System } from 'src/app/models/health';
import { HealthMonitoringService } from 'src/app/services/Info/health-monitoring.service';
import { StatusToReadable, DroneStatus } from 'src/app/models/drone';
import { ExternalComponentsMonitoringService } from 'src/app/services/Info/external-components-monitoring.service';

import { OperatorService } from 'src/app/services/users/operator.service';
@Component({
  selector: 'app-relay-monitoring',
  templateUrl: './relay-monitoring.component.html',
  styleUrls: ['./relay-monitoring.component.scss']
})
export class RelayMonitoringComponent implements OnInit {

  public SocketStatus = SocketStatus;
  public DroneConnectionStatus = DroneConnectionStatus;
  public StatusToReadable = StatusToReadable;
  
  public PcToHubStatus = PcToHubStatus;
  public HubToAutomatonStatus = HubToAutomatonStatus;
  public HubStatus = HubStatus;
  public AutomatonStatus = AutomatonStatus;


  public System = System;
  public SubSystem = SubSystem;

  public externalModuleRestart(target: string, system: System, module: SubSystem){
    if(!this.dronedata.availableDrones.includes(target)) return;
    if(System.External !== system) return;
    this.extModuleMonitoring.restartModule(target, module);
  }
  
  public brainModuleRestart(system: string, module: string){
    this.health.restartModule(system, module);
  }

  public get socketConnection(){
    return this.connector.websocketStatus;
  }

  constructor(public dronedata : DroneDataService, public operatorService: OperatorService, public health: PingService, public automatonMonitoring : HealthMonitoringService, private extModuleMonitoring: ExternalComponentsMonitoringService, private connector: WebsocketService) {
    dronedata.availableDrones.forEach(droneName => {
      extModuleMonitoring.forceUpdate(droneName);
    })
    
  }

  ngOnInit(): void {
  }

  public getKeys(map: any){
      return Array.from(map.keys());
  }

  public automatonStatus(name: string){
    return this.automatonMonitoring.automatonStatus(name);
  }

  public moduleStatus(name: string){
    let result = this.extModuleMonitoring.moduleStatuses(name);
    if(result != null) return result;
    return new Map<string, Map<string, boolean>>()
  }


  public availableFields(statut: DroneStatus): Array<string>{
    return Object.keys(statut);
  }

  public displayStatus(statut: StatusToReadable, current: boolean): string{
    switch(statut){
      case StatusToReadable.on_error:
        return (current ? "error" : "ok"); 
      case StatusToReadable.sim:
      case StatusToReadable.manual:
        return (current ? "warning":"ok");
      default : 
        return (current ? "ok" : "error");
    }
  }

}
