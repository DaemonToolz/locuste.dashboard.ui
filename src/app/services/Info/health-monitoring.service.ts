import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../http/generic/generic-http-client';

import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { DroneStatus, DroneIdentifier } from '../../models/drone';
import { take } from 'rxjs/operators';
import { DroneConnectionStatus } from 'src/app/models/notifications';
import { SocketStatus } from 'src/app/models/status';

@Injectable({
  providedIn: 'root'
})
export class HealthMonitoringService  extends GenericHttpService<DroneStatus> {

  private _onStatusUpdate: Subscription;
  private _onConnectionEvent: Subscription;
  private _onWebsocketEvent: Subscription;

  private _automatonStatuses : Map<string, DroneStatus> = new Map<string, DroneStatus>();

  constructor(_http: HttpClient,  private updaters: WebsocketService) { 
    super(_http)
    this.init(environment.services.drone_info); 
    this._onStatusUpdate = this.updaters.statusUpdate$.subscribe((identifier) => {
      if(identifier != null && identifier.name != null && identifier.name.trim() !== ""){
        this.fetchStatus(identifier.name).pipe(take(1)).subscribe(status => {
          this._automatonStatuses.set(identifier.name, status);
        });
      }
    })

    this._onConnectionEvent = this.updaters.droneEvents$.subscribe(notification => {
      if(notification != null){
        // Perte de connexion de tout le réseau
        if(notification.name == null && notification.droneStatus === DroneConnectionStatus.disconnected){
          this.availableAutomatons.forEach(automaton => {
            this._automatonStatuses.get(automaton).available = false;
          })
        } else if (notification.droneStatus === DroneConnectionStatus.connected && notification.name != null && notification.name.trim() !== "") {
          this.fetchStatus(notification.name).pipe(take(1)).subscribe(status => {
            this._automatonStatuses.set(notification.name, status);
          });
        }
      }
    })

    this._onWebsocketEvent = this.updaters.socketEvents$.subscribe(event => {
      if(this.updaters.websocketStatus === SocketStatus.connected){
        this._automatonStatuses.forEach((value,key) => {
          this.fetchStatus(key).pipe(take(1)).subscribe(status => {
            this._automatonStatuses.set(key, status);
          });
        })
      }
    })
  }

  public forceUpdate(name: string): void {
    if( name == null || name.trim() === ""){
      return;
    }
    this.fetchStatus(name).pipe(take(1)).subscribe(status => {
      this._automatonStatuses.set(name, status);
    });
  }

  private fetchStatus(name :string): Observable<DroneStatus>{
    return this.get(`drone/${name}`);
  }


  public automatonStatus(name: string){
    return this._automatonStatuses.get(name);
  }

  public get availableAutomatons() : string[]{
    return Array.from( this._automatonStatuses.keys() );
  }

  public isManualUnit(name: string): boolean {
    if(!this._automatonStatuses.has(name)) return false;
    return this._automatonStatuses.get(name).manual
  }

  public isTested(name: string): boolean {
    if(!this._automatonStatuses.has(name)) return false;
    return this._automatonStatuses.get(name).sim
  }

  

}
