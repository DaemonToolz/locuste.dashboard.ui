import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../http/generic/generic-http-client';

import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { first, catchError } from 'rxjs/operators';
import { ManualCommandRequest } from 'src/app/models/commands';

@Injectable({
  providedIn: 'root'
})
export class ManualCommandRequestService extends GenericHttpService<any> {

  constructor(_http: HttpClient) {
    super(_http);
    this.init(environment.services.drone_info); 
  }


  public sendCommand(droneName: string, myCommand: ManualCommandRequest) : Observable<any>{
    return this.post("command", {target: droneName, command: myCommand} );
  }
}
