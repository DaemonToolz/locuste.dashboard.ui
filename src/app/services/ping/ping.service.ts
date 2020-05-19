import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../http/generic/generic-http-client';

import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { first, catchError, take } from 'rxjs/operators';
import { System, SubSystem} from 'src/app/models/health'
import { WebsocketService } from '../websocket.service';
import { SocketStatus } from 'src/app/models/status';

@Injectable({
  providedIn: 'root'
})
export class PingService extends GenericHttpService<any>{
 
  private _healthMonitor : Map<string, Map<string, boolean>> = new Map<string, Map<string, boolean>>()
  public isRelayReachable: boolean = true; // On assume par défaut que ça marche
  private source = interval(1000);
  private myErrors : Subscription;

  public get healthMonitor(){
    return this._healthMonitor;
  } 


  private healthMapToArray(input : Map<string,boolean>){
    input.forEach((value: boolean, key: string) => {
      let systemData = key.split(".");
      if(!this._healthMonitor.has(systemData[0])){
        this._healthMonitor.set(systemData[0],new Map<string, boolean>());
      }
      this._healthMonitor.get(systemData[0]).set(systemData[1], value);
    });
    
  }

  constructor(_http: HttpClient, private updater: WebsocketService) {
    super(_http);
    this.init(environment.services.drone_info); 
    this.source.subscribe(() => {
      this.get("health").pipe(first()).subscribe(data => {
        this.healthMapToArray(new Map(Object.entries(data)));
        this.connected(true);
      }, err => this.connected(false))
    }, err => this.connected(false));

    this.myErrors = this.onError.subscribe((error) => {
      this.connected(false);
    })
  }

  public connected(data: boolean) {
    this.isRelayReachable = data;
  }

  public restartModule(system: string, subsystem : string){
    if(this.isRelayReachable){
      this.restartModuleRequest(system, subsystem)
    } else if(this.updater.websocketStatus === SocketStatus.connected){
      this.updater.restartModuleRequest(system, subsystem)
    }
  }

  private restartModuleRequest(system: string, subsystem: string) {
    this.post("server/module/restart", {"system": system, "subsystem": subsystem}).pipe(take(1)).subscribe();
  }
}
