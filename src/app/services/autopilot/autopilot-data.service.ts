import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DroneFlightCoordinates, SimplifiedDroneFlightCoordinates } from 'src/app/models/coordinates';
import { GenericHttpService } from '../http/generic/generic-http-client';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SchedulerSummarizedData } from 'src/app/models/autopilot';

@Injectable({
  providedIn: 'root'
})
export class AutopilotDataService extends GenericHttpService<SchedulerSummarizedData>  {
  private _onAutopilotUpdate: Subscription;
  private _onRecalculation: Subscription;
  private _onAutopilotStatusUpdate: Subscription;
  
  private _autopilotData: Map<string, DroneFlightCoordinates> = new Map(); 
  private _autoPilotStatuses: Map<string, SchedulerSummarizedData> = new Map(); 
  private _target: Map<string, SimplifiedDroneFlightCoordinates> = new Map();  



  public autopilotUpdate$ : BehaviorSubject<DroneFlightCoordinates> = new BehaviorSubject(null);
  public targetUpdate$ : BehaviorSubject<SimplifiedDroneFlightCoordinates> = new BehaviorSubject(null);
  
  constructor(_http: HttpClient, private updater : WebsocketService) { 
    super(_http);
    this.init(environment.services.drone_info); 
    this._onAutopilotUpdate = this.updater.autopilotUpdate$.subscribe(autopilotData => {
      if(autopilotData != null){
          this._autopilotData.set(autopilotData.drone_name, autopilotData)
          this.autopilotUpdate$.next(autopilotData);
      }
    })

    this._onAutopilotStatusUpdate = this.updater.autopilotStatusUpdate$.subscribe(data => {

      if(data != null) {
        this._autoPilotStatuses.set(data.drone_name, data)
      }
    })

    this._onRecalculation = this.updater.targetUpdate$.subscribe(target => {
      if(target != null){
        this._target.set(target.name, target)
        this.targetUpdate$.next(target);
      }
    })
  }

  public AutopilotData(drone: string):DroneFlightCoordinates{
    if(this._autopilotData.has(drone)) return this._autopilotData.get(drone);
    return null;
  }

  public Target(drone: string):SimplifiedDroneFlightCoordinates{
    if(this._target.has(drone)) return this._target.get(drone);
    return null;
  }


  public AutoPilot(drone: string):SchedulerSummarizedData{
    if(this._autoPilotStatuses.has(drone)) return this._autoPilotStatuses.get(drone);
    return null;
  }

  public SendTarget(coordinates: SimplifiedDroneFlightCoordinates){
    this.postAny(`drone/${coordinates.name}/course/set`, coordinates).pipe(take(1)).subscribe();
  }

  public getAutopilot(name: string){
    return this.get(`drone/${name}/autopilot`)
  }


  public refreshAutopilot(name: string){
    this.get(`drone/${name}/autopilot`).pipe(take(1)).subscribe(result => {
      this._autoPilotStatuses.set(name, result);
    })
  }

  public setAutopilotOn(name: string){
    return this.get(`drone/${name}/autopilot/on`).pipe(take(1)).subscribe()
  }

  public setAutopilotOff(name: string){
    return this.get(`drone/${name}/autopilot/off`).pipe(take(1)).subscribe()
  }
}
