import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ManualCommandRequestService } from 'src/app/services/drone/manual-command-request.service';
import { ManualCommandRequest } from 'src/app/models/commands';
import { take } from 'rxjs/operators';
import { HealthMonitoringService } from 'src/app/services/Info/health-monitoring.service';
import { DroneDataService } from 'src/app/services/drone/drone-data.service';
import { BatteryStatus, GPSStatus, GPSStrength, WifiStatus, WifiStrength, DroneSettings } from 'src/app/models/drone';
import { MatDialog } from '@angular/material/dialog';
import { ControlTutorialDialogComponent } from '../tutorial/control-tutorial-dialog/control-tutorial-dialog.component';
import { OperatorService } from 'src/app/services/users/operator.service';
import { AutopilotDataService } from 'src/app/services/autopilot/autopilot-data.service';
import { DroneConsoleSettingsComponent } from '../shared/drone-console-settings/drone-console-settings.component';
import { DroneSettingsService } from 'src/app/services/drone/drone-settings.service';

@Component({
  selector: 'app-drone-console',
  templateUrl: './drone-console.component.html',
  styleUrls: ['./drone-console.component.scss']
})
export class DroneConsoleComponent implements OnInit, OnDestroy {
  public BatteryStatus = BatteryStatus;
  public GPSStatus = GPSStatus;
  public GPSStrength = GPSStrength;
  public WifiStatus = WifiStatus;
  public WifiStrength = WifiStrength;

  public selectedDrone = "";
  public get isManual(){
    return this.droneStatusController.isManualUnit(this.selectedDrone);
  } 

  public get isTested(){
    return this.droneStatusController.isTested(this.selectedDrone);
  } 

  public get droneBattery(){
    return (this.droneData.droneBattery(this.selectedDrone))
  }

  public get getBatteryStatus(){
    return (this.droneData.batteryStatus(this.selectedDrone))
  }

  public get getDroneLeader(){
    return this.operatorService.getLeader(this.selectedDrone);
  }

  public get getAutopilotStatus(){
    return this.autoPilotService.AutoPilot(this.selectedDrone)
  }

  public get isAutopilotOperational():boolean{
    let autopilot = this.autoPilotService.AutoPilot(this.selectedDrone)
    return autopilot.is_running &&   autopilot.is_active
  }

  public get isAutopilotInactive():boolean{
    let autopilot = this.autoPilotService.AutoPilot(this.selectedDrone)
    return autopilot.is_running &&  !autopilot.is_active
  }

  public get isAutopilotOffline():boolean{
    let autopilot = this.autoPilotService.AutoPilot(this.selectedDrone)
    return !autopilot.is_running
  }

  public get getGPSStatus() :GPSStatus{
    let coordinates = this.droneData.droneCoordinates(this.selectedDrone)
    if(coordinates == null) { return GPSStatus.not_registered } 
    if((coordinates.latitude === coordinates.longitude && coordinates.longitude === 500)) return GPSStatus.unavailable
    return GPSStatus.ready
  }

  public get getGPSStrength() : GPSStrength{
    return this.droneData.gpsStrength(this.selectedDrone)
  }


  public get getWifiStatus() :WifiStatus{
    let coordinates = this.droneData.droneWifi(this.selectedDrone)
    if(coordinates == -500) { return WifiStatus.unavailable } 
    return WifiStatus.ready
  }

  public get getWifiStrength() : WifiStrength{
    return this.droneData.wifiStrength(this.selectedDrone)
  }

  private _width : number;
  private _height: number;
  
  public get width(){return this._width}
  public get height(){return this._height}

  constructor(private route: ActivatedRoute, private droneSettingsService: DroneSettingsService, private operatorService: OperatorService, private droneData :DroneDataService, private connector: WebsocketService, private requester :ManualCommandRequestService, private droneStatusController: HealthMonitoringService, private dialog: MatDialog, private autoPilotService: AutopilotDataService) { 
    this.selectedDrone = this.route.snapshot.paramMap.get('droneid');
    this._width = window.outerWidth/1.35;
    this._height = window.outerHeight/1.35;
  }

  // On quite la page, on repasse en automatic pour éviter les problèmes
  ngOnDestroy(): void {
    this.changeFlightModel(true);
    this.changeTestingMode(true);
    this.operatorService.releaseControls()
  }

  ngOnInit(): void {
  }


  public showTutorial(){
    this.dialog.open(ControlTutorialDialogComponent,  {width:'75%', height:'75%'});
  }

  public showSettings(){
    this.droneSettingsService.fetchSettings(this.selectedDrone)
    const dref = this.dialog.open(DroneConsoleSettingsComponent, {width:'75%', data: this.droneSettingsService.droneSettings.get(this.selectedDrone)});
    dref.afterClosed().pipe(take(1)).subscribe(result => {
      if(result != null) {
        this.droneSettingsService.updateSettings(result as DroneSettings);
      }
    });
  }

  public changeFlightModel(forceAutomatic : boolean = false){
    if(this.isManual || forceAutomatic){
      this.requester.sendCommand(this.selectedDrone, ManualCommandRequest.RequestAutomaticFlight).pipe(take(1)).subscribe()
    } else {
      this.requester.sendCommand(this.selectedDrone, ManualCommandRequest.RequestManualFlight).pipe(take(1)).subscribe()
    }
  }

  public changeTestingMode(forceNormal : boolean = false){
    if(this.isTested || forceNormal){
      this.requester.sendCommand(this.selectedDrone, ManualCommandRequest.RequestNormal).pipe(take(1)).subscribe()
    } else {
      this.requester.sendCommand(this.selectedDrone, ManualCommandRequest.RequestSimulation).pipe(take(1)).subscribe()
    }
  }


  public askDisconnectAutomaton(){
    this.requester.sendCommand(this.selectedDrone, ManualCommandRequest.RequestEmergencyDisconnect)
  }

  public askReconnectAutomaton(){
    this.requester.sendCommand(this.selectedDrone, ManualCommandRequest.RequestEmergencyReconnect)
  }

  private sendCommand(keycode: number){
    this.connector.sendCommand(this.selectedDrone,keycode); 
  }



  @HostListener('document:keydown.z', ['$event']) 
  OnZDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }

  @HostListener('document:keydown.q', ['$event']) 
  OnQDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }

  @HostListener('document:keydown.d', ['$event']) 
  OnDDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }
 
  @HostListener('document:keydown.s', ['$event']) 
  OnSDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }
  @HostListener('document:keydown.a', ['$event']) 
  OnADownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }
  @HostListener('document:keydown.e', ['$event']) 
  OnEDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }


  @HostListener('document:keydown.t', ['$event']) 
  OnTDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }


  @HostListener('document:keydown.g', ['$event']) 
  OnGDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }


  @HostListener('document:keydown.arrowup', ['$event']) 
  OnArrowUpHander(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }

  @HostListener('document:keydown.arrowdown', ['$event']) 
  OnArrowDownHander(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }
  @HostListener('document:keydown.r', ['$event']) 
  OnRDownHandler(event: KeyboardEvent) {
    this.sendCommand(event.keyCode);
  }

}
