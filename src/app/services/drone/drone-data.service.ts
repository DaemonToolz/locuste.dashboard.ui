import { Injectable } from '@angular/core';
import { DroneDiscoveryService } from '../Info/drone-discovery.service';
import { WebsocketService } from '../websocket.service';
import { take, retry, catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DroneNotification, DroneInternalStatusNotification } from 'src/app/models/notifications';
import { HealthMonitoringService } from '../Info/health-monitoring.service';
import { ExternalComponentsMonitoringService } from '../Info/external-components-monitoring.service';
import { BatteryStatus, GPSStrength, WifiStrength, InternalStatuses } from 'src/app/models/drone';
import { AutopilotDataService } from '../autopilot/autopilot-data.service';
import { DroneCoordinates } from 'src/app/models/coordinates';

@Injectable({
  providedIn: 'root'
})
export class DroneDataService {
  private _availableDrones: string[] = [];
  private _onDroneEvent: Subscription;
  private _onDroneInternalEvent: Subscription;
  private _onDronePositionUpdate: Subscription;

  private _droneStatuses: DroneNotification[] = [];
  private _droneInternalStatuses: Map<string, Map<InternalStatuses, any>> = new Map<string, Map<InternalStatuses, any>>();
  private _droneCoordinates: Map<string, DroneCoordinates> = new Map<string,DroneCoordinates>();


  public get availableDrones(): string[] {
    return this._availableDrones
  }

  public get droneStatuses(): DroneNotification[] {
    return this._droneStatuses
  }

  public droneCoordinates(name: string): DroneCoordinates {
    if(!this._droneCoordinates.has(name)){
      return null
    }
    return this._droneCoordinates.get(name)
  }

  public droneInternalStatus(name: string): Map<string, any> {
    if (!this._droneInternalStatuses.has(name)) return null
    return this._droneInternalStatuses.get(name)
  }

  public batteryStatus(name:string): BatteryStatus{
    if(this.droneBattery(name) > 75) return BatteryStatus.high
    if(this.droneBattery(name) > 50) return BatteryStatus.medium
    if(this.droneBattery(name) > 25) return BatteryStatus.low
    return BatteryStatus.critical;     
  }


  public gpsStrength(name:string): GPSStrength{
    if(this.droneGPS(name) > 18) return GPSStrength.high
    if(this.droneGPS(name) > 10) return GPSStrength.medium
    return GPSStrength.low
  }


  public wifiStrength(name:string): WifiStrength{
    if(this.droneWifi(name) <= -30 && this.droneWifi(name) > -45 ) return WifiStrength.high
    if(this.droneWifi(name) <= -45 && this.droneWifi(name) > -80 ) return WifiStrength.medium
    return WifiStrength.low
  }

  public droneBattery(name: string): number {
    if (this.droneInternalStatus(name) != null && this.droneInternalStatus(name).has(InternalStatuses.BatteryStateChanged)) {
      return this._droneInternalStatuses.get(name).get(InternalStatuses.BatteryStateChanged) as number;
    }
    return 100
  }

  public droneGPS(name: string): number {
    if (this.droneInternalStatus(name) != null && this.droneInternalStatus(name).has(InternalStatuses.numberOfSatelliteChanged)) {
      return this._droneInternalStatuses.get(name).get(InternalStatuses.numberOfSatelliteChanged) as number;
    }
    return 0
  }

  public droneWifi(name: string): number {
    if (this.droneInternalStatus(name) != null && this.droneInternalStatus(name).has(InternalStatuses.rssi_changed)) {
      return this._droneInternalStatuses.get(name).get(InternalStatuses.rssi_changed) as number;
    }
    return -500 // https://developer.parrot.com/docs/olympe/arsdkng_wifi.html?highlight=rssi#olympe.messages.wifi.rssi_changed
  }


  constructor(private droneDiscovery: DroneDiscoveryService, private connector: WebsocketService, droneMonitorService: HealthMonitoringService, private droneAutopilotService: AutopilotDataService) {
    this.droneDiscovery.getDroneInfo().pipe(retry(20), take(1)).subscribe(data => {
      this._availableDrones = data;
      data.forEach(name => {
        droneMonitorService.forceUpdate(name)
        this.droneAutopilotService.refreshAutopilot(name)
      })

      this._onDronePositionUpdate = this.connector.positionUpdate$.subscribe((position: DroneCoordinates) => {
        if(position != null){
          this._droneCoordinates.set(position.id, position);
        }
      });
  
    })

    this._onDroneInternalEvent = this.connector.internalStatusUpdate$.subscribe((notification: DroneInternalStatusNotification) => {
      try {
        if (!this._droneInternalStatuses.has(notification.id)) {
          this._droneInternalStatuses.set(notification.id, new Map<InternalStatuses, any>())
        }
        this._droneInternalStatuses.get(notification.id).set(InternalStatuses[notification.status], notification.result);
      } catch {

      }
    })

    this._onDroneEvent = this.connector.droneEvents$.subscribe((notification: DroneNotification) => {

      if (notification != null) {
        if (notification.name != null) {
          let index = this._availableDrones.findIndex(data => data == notification.name)
          if (index == -1) {
            this._availableDrones.push(notification.name)
          }

          index = this._droneStatuses.findIndex(data => data.name == notification.name)
          if (index == -1) {
            this._droneStatuses.push(notification)
          } else {
            this._droneStatuses[index] = notification;
          }

        } else {
          this._droneStatuses.splice(0);
          this._availableDrones.forEach(drone => {
            let droneNotification = { ...notification }
            droneNotification.name = drone
            this._droneStatuses.push(droneNotification);
          })
        }
      }
    })
  }


}
