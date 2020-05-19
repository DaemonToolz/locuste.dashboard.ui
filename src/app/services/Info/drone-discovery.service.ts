import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../http/generic/generic-http-client';

import { environment } from 'src/environments/environment';
import { Drone } from 'src/app/models/drone';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';
@Injectable({
  providedIn: 'root'
})
export class DroneDiscoveryService extends GenericHttpService<string> {

  constructor(_http: HttpClient) { 
    super(_http)
    this.init(environment.services.drone_info); 
  }

  public getDroneInfo() : Observable<string[]>{
    return this.getArray("drones");
  }
}
