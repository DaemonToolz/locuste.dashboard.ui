import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../http/generic/generic-http-client';

import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { DroneStatus, DroneIdentifier } from '../../models/drone';
import { take, first } from 'rxjs/operators';
import { DroneConnectionStatus } from 'src/app/models/notifications';
import { SocketStatus } from 'src/app/models/status';
import { SubSystem } from 'src/app/models/health';
@Injectable({
  providedIn: 'root'
})
export class ExternalComponentsMonitoringService extends GenericHttpService<any> {
  private _onStatusUpdate: Subscription;
  private _onConnectionEvent: Subscription;


  private _moduleStatuses : Map<string, Map<string, Map<string, boolean> > >= new Map<string, Map<string, Map<string, boolean> > >();

  
  constructor(_http: HttpClient,  private updaters: WebsocketService) { 
    super(_http)
    this.init(environment.services.drone_info); 

    this._onStatusUpdate = this.updaters.externalModuleStatusUpdate$.subscribe((identifier) => {
      if(identifier != null && identifier.name != null && identifier.name.trim() !== ""){
        this.fetchStatus(identifier.name).pipe(first()).subscribe(data => {
          this.healthMapToArray(identifier.name, new Map(Object.entries(data)));
        })        
      }
    })

    this._onConnectionEvent = this.updaters.droneEvents$.subscribe(notification => {
      if(notification != null && notification.name != null && notification.name.trim() !== ""){
        this.fetchStatus(notification.name).pipe(first()).subscribe(data => {
          this.healthMapToArray(notification.name, new Map(Object.entries(data)));
        })
      }
    })

  }


  private healthMapToArray(target: string, input : Map<string,boolean>){
    input.forEach((value: boolean, key: string) => {
      let systemData = key.split(".");
      if(!this._moduleStatuses.has(target)){
        this._moduleStatuses.set(target,new Map<string, Map<string, boolean> >());
        this._moduleStatuses.get(target).set(systemData[0], new Map<string, boolean>())
      }
      this._moduleStatuses.get(target).get(systemData[0]).set(systemData[1], value);
    });
    
  }


  public forceUpdate(name: string): void {
    if( name == null || name.trim() === ""){
      return;
    }
    this.fetchStatus(name).pipe(take(1)).subscribe(data => {
      this.healthMapToArray(name, new Map(Object.entries(data)));
    });
  }

  private fetchStatus(droneName:string){
    return this.get(`drone/${droneName}/health`);
  }


  public moduleStatuses(name: string){
    return this._moduleStatuses.get(name);
  }

  public restartModule(droneName: string, module: SubSystem){
    let target = ""
    switch(module){
      case SubSystem.VideoStream:
        target = "stream"  
        break;
      case SubSystem.VideoServer:
        target = "video"
        break;
    }
    this.get(`drone/${droneName}/${target}/restart`).pipe(take(1)).subscribe();
  }

}
