import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { latLng, tileLayer, LatLngBounds, Map as WorldMap, Marker, icon } from 'leaflet';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';
import { DroneCoordinates, DroneMarker } from 'src/app/models/coordinates';
import { MapServiceService } from 'src/app/services/maps/map-service.service';
import { Boundaries } from 'src/app/models/map';
import { take } from 'rxjs/operators';
import { AutopilotDataService } from 'src/app/services/autopilot/autopilot-data.service';

@Component({
  selector: 'app-city-map',
  templateUrl: './city-map.component.html',
  styleUrls: ['./city-map.component.scss']
})
export class CityMapComponent implements OnInit, OnDestroy {
  public options: any;
  private myMap: WorldMap;
  
  private onUpdate: Subscription;

  private myDrones: Map<string, DroneMarker> = new Map();
  private myBoundaries: Boundaries
  

  constructor(private updater: WebsocketService, private autoPilotService: AutopilotDataService, private mapService: MapServiceService) {
    this.onUpdate = this.updater.positionUpdate$.subscribe((position: DroneCoordinates) => {
      if (position != null && this.myMap != null) {
        if (this.myDrones.has(position.id)) {
          this.myDrones.get(position.id).Coordinates = position;
        } else {
          let marker = new DroneMarker();
          marker.coordinates = position;
          marker.marker = new Marker(latLng(position.latitude, position.longitude), {
            icon: icon({
              iconSize: [25, 25],
              iconAnchor: [10, 10],
              iconUrl: 'assets/images/marker-icon.png',
              iconRetinaUrl: 'assets/images/marker-icon-2x.png',
              shadowUrl: 'assets/images/marker-shadow.png'
            })
          });
          marker.marker.addTo(this.myMap)
          this.myDrones.set(position.id, marker)
        }

      }
    })

    

    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 15, })
      ],
      zoom: 15,
      center: latLng(50.5177, 2.8147)
    };


    this.mapService.getMapBoundaries().pipe(take(1)).subscribe(result => {
      this.myBoundaries = result;
      if (this.myMap != null && result != null) {
        this.defineBoundaries()
      }
    })
  }
  ngOnDestroy(): void {
    this.onUpdate.unsubscribe();

  }



  onMapReady(map: WorldMap) {
    this.myMap = map;
    if (this.myBoundaries != null) {
      this.defineBoundaries()
    }
  
  } 

  private defineBoundaries() {
    let bound = new LatLngBounds(latLng(this.myBoundaries.min_lat, this.myBoundaries.min_lon), latLng(this.myBoundaries.max_lat, this.myBoundaries.max_lon));
    this.myMap.setMaxBounds(bound)
    this.myMap.fitBounds(bound)
  }


  ngOnInit(): void {

  }

  private addMark(markName: string, coordinates: DroneCoordinates){
    this[markName] = new Marker(latLng(coordinates.latitude,coordinates.longitude), {
      icon: icon({
        iconSize: [75, 75],
        iconAnchor: [25, 25],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon-2x.png',
        shadowUrl: 'assets/images/marker-shadow.png'
      })
    });

    if(this.myMap != null) {
      (<Marker<any>>this[markName]).addTo(this.myMap)
    }

  }

  private setMark(markName: string, coordinates :DroneCoordinates){
      if(this[markName] != null){
       (<Marker<any>>this[markName]).setLatLng(latLng(coordinates.latitude, coordinates.longitude))
      }
  }
}
