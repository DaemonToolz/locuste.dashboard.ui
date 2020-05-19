import { Injectable } from '@angular/core';
import { Boundaries } from 'src/app/models/map';
import { GenericHttpService } from '../http/generic/generic-http-client';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class MapServiceService extends GenericHttpService<Boundaries> {

  constructor(_http: HttpClient) { 
    super(_http)  
    this.init(environment.services.drone_info); 
  }

  public getMapBoundaries(){
    return this.get("map/boundaries");
  }

}
