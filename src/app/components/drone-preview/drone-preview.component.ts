import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { take, retry } from 'rxjs/operators';
import { DroneDiscoveryService } from 'src/app/services/Info/drone-discovery.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Router } from '@angular/router';
import { DroneDataService } from 'src/app/services/drone/drone-data.service';
import { HealthMonitoringService } from 'src/app/services/Info/health-monitoring.service';
import { BatteryStatus, GPSStatus, WifiStatus, GPSStrength, WifiStrength } from 'src/app/models/drone';
import { OperatorService } from 'src/app/services/users/operator.service';
import { AutopilotDataService } from 'src/app/services/autopilot/autopilot-data.service';
import { Subscription } from 'rxjs';
import { SchedulerSummarizedData } from 'src/app/models/autopilot';
import { ViewsEnum } from 'src/app/models/navigation';
import { ManualCommandRequestService } from 'src/app/services/drone/manual-command-request.service';
import { AutomatedCommandRequest } from 'src/app/models/commands';

@Component({
  selector: 'app-drone-preview',
  templateUrl: './drone-preview.component.html',
  styleUrls: ['./drone-preview.component.scss']
})
export class DronePreviewComponent {

  public BatteryStatus = BatteryStatus;
  public GPSStatus = GPSStatus;
  public GPSStrength = GPSStrength;
  public WifiStatus = WifiStatus;
  public WifiStrength = WifiStrength;
  public ViewsEnum = ViewsEnum;

  private _views : Map<string, ViewsEnum> = new Map<string, ViewsEnum>()
  
  private autopilotUpdate: Subscription; 
  
  public get availableDrones() : string[] {
    return this.droneData.availableDrones
  }

  public  isManual(droneName: string){
    return this.droneStatusController.isManualUnit(droneName);
  } 

  public  isTested(droneName: string){
    return this.droneStatusController.isTested(droneName);
  } 

  public changeAutopilotStatus(droneName: string){
    let autopilot = this.autoPilotService.AutoPilot(droneName);

    if(autopilot.is_active){
      this.autoPilotService.setAutopilotOff(droneName)
    } else {
      this.autoPilotService.setAutopilotOn(droneName)
    }
  }

  private _width : number;
  private _height: number;
  
  public get width(){return this._width}
  public get height(){return this._height}

  public isAutopîlotBusy(drone: string) :string{
    let data = this.autoPilotService.AutoPilot(drone)
    if(data == null) return "primary"
    return this.autoPilotService.AutoPilot(drone).is_busy ? "warn": "primary";
  }


  public droneBattery(drone: string){
    return (this.droneData.droneBattery(drone))
  }

  public getBatteryStatus(drone: string){
    return (this.droneData.batteryStatus(drone))
  }

  public getDroneLeader(name: string){
    return this.operatorService.getLeader(name);
  }

  public changeView(drone: string, view: ViewsEnum){
    this._views.set(drone, view)
  }

  public isOnView(drone: string, view: ViewsEnum){
    if(!this._views.has(drone)) {
      this.changeView(drone, ViewsEnum.DroneCameraView)
    }
    return this._views.has(drone) ? this._views.get(drone) === view : false   
  }

  constructor(private droneData :DroneDataService, private _commandRequest: ManualCommandRequestService,  private operatorService: OperatorService, 
      private droneStatusController: HealthMonitoringService, private autoPilotService: AutopilotDataService) { 
    this._width = window.outerWidth/3;
    this._height = window.outerHeight/3;
    
  
  } 

  public getAutopilotStatus(droneName: string){
    return this.autoPilotService.AutoPilot(droneName)
  }

  public getFlyingStatus(droneName: string){
    return this.droneData.droneFlyingStatuses(droneName)
  }

  public isAutopilotOperational(droneName: string):boolean{
    let autopilot = this.autoPilotService.AutoPilot(droneName)
    return autopilot.is_running &&   autopilot.is_active
  }

  public isAutopilotInactive(droneName: string):boolean{
    let autopilot = this.autoPilotService.AutoPilot(droneName)
    return autopilot.is_running &&  !autopilot.is_active
  }

  public isAutopilotOffline(droneName: string):boolean{
    let autopilot = this.autoPilotService.AutoPilot(droneName)
    return !autopilot.is_running
  }

  public getGPSStatus(droneName: string) :GPSStatus{
    let coordinates = this.droneData.droneCoordinates(droneName)
    if(coordinates == null) { return GPSStatus.not_registered } 
    if((coordinates.latitude === coordinates.longitude && coordinates.longitude === 500)) return GPSStatus.unavailable
    return GPSStatus.ready
  }

  public getGPSStrength(droneName: string) : GPSStrength{
    return this.droneData.gpsStrength(droneName)
  }


  public getWifiStatus(droneName: string) :WifiStatus{
    let coordinates = this.droneData.droneWifi(droneName)
    if(coordinates == -500) { return WifiStatus.unavailable } 
    return WifiStatus.ready
  }

  public getWifiStrength(droneName: string) : WifiStrength{
    return this.droneData.wifiStrength(droneName)
  }

  public takeoff_Land(droneName: string) {
    let target = this.droneData.droneFlyingStatuses(droneName);

    if(target != null && !target.is_going_home){

      if(target.is_landed){
        this._commandRequest.sendAutomatedCommand(droneName, AutomatedCommandRequest.TakeOff).pipe(take(1)).subscribe()
      } else if(target.is_home_ready){
        this._commandRequest.sendAutomatedCommand(droneName, AutomatedCommandRequest.GoHome).pipe(take(1)).subscribe()
      }
    }
  }
}
