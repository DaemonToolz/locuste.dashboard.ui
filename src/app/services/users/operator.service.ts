import { Injectable } from '@angular/core';
import { Operator } from '../../models/operator';
import { GenericHttpService } from '../http/generic/generic-http-client';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WebsocketService } from '../websocket.service';
import { Subscription, Observable } from 'rxjs';
import { take, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperatorService extends GenericHttpService<Operator>{
  private onOperatorChange : Subscription;
  private _operators : Operator[] = [];
  private _myself : Operator;

  public get operators(){
    return this._operators;
  }

  public get myself(){
    return this._myself;
  }

  constructor(_http: HttpClient,  private connector: WebsocketService) {
    super(_http);
    this.init(environment.services.drone_info); 
   
    this.fetchOperators().pipe(first()).subscribe(data => {
      this._operators = data;
      this._myself = data.find(op => op.channel_id === this.connector.socket.id);
    })

    this.onOperatorChange = this.connector.operatorUpdate$.subscribe(update => {
      if(update){
        this.fetchOperators().pipe(first()).subscribe(data => {
          this._operators = data;
          this._myself = data.find(op => op.channel_id === this.connector.socket.id);
        })
      }
    })
  }

  public getLeader(drone: string){
    return this.operators.find(op => drone = op.controlled_drone)?.name;
  }

  public authenticate(username: string){
    this.connector.authenticate(username)
  }


  public releaseControls(){
    this.connector.releaseControls()
  }


  private fetchOperators(): Observable<Operator[]>{
    return this.getArray("operators");
  }
}
