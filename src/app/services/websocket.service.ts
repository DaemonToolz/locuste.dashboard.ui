import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { SocketFunction, MyListeners} from '../models/sockets'
import { WebSocketNotification, NotificationType, DroneNotification, DroneConnectionStatus, DroneInternalStatusNotification} from '../models/notifications'
import { SocketStatus } from '../models/status'

import { BehaviorSubject } from 'rxjs';
import { IdentificationRequest, DroneIdentifier, DroneStatus } from '../models/drone';
import { DroneCoordinates, DroneFlightCoordinates, SimplifiedDroneFlightCoordinates } from '../models/coordinates';
import { SchedulerSummarizedData, DroneSummarizedStatus } from '../models/autopilot';


@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private static Socket: SocketIOClient.Socket;
  private static WebsocketStatus : SocketStatus;
  private static MyTimers : Map<string, any>  = new Map<string,any>();

  public get websocketStatus(){
    return WebsocketService.WebsocketStatus;
  }

  public get socket(){
    return WebsocketService.Socket;
  }

  private clearTimer(name: string){
    if(WebsocketService.MyTimers.has(name)){
      clearTimeout(WebsocketService.MyTimers.get(name))
      WebsocketService.MyTimers.delete(name)
    }
  }

  public socketEvents$ : BehaviorSubject<WebSocketNotification> = new BehaviorSubject(null);
  public droneEvents$ : BehaviorSubject<DroneNotification> = new BehaviorSubject(null);
  public statusUpdate$ : BehaviorSubject<DroneIdentifier> = new BehaviorSubject<DroneIdentifier>(null);
  public internalStatusUpdate$ : BehaviorSubject<DroneInternalStatusNotification> = new BehaviorSubject<DroneInternalStatusNotification>(null);
  public externalModuleStatusUpdate$ : BehaviorSubject<DroneIdentifier> = new BehaviorSubject<DroneIdentifier>(null);
  public operatorUpdate$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public positionUpdate$ : BehaviorSubject<DroneCoordinates> = new BehaviorSubject(null);
  public autopilotUpdate$ : BehaviorSubject<DroneFlightCoordinates> = new BehaviorSubject(null);
  public autopilotStatusUpdate$ : BehaviorSubject<SchedulerSummarizedData> = new BehaviorSubject(null);
  public flyingStatusUpdate$ : BehaviorSubject<DroneSummarizedStatus> = new BehaviorSubject(null);
  
  public targetUpdate$ : BehaviorSubject<SimplifiedDroneFlightCoordinates> = new BehaviorSubject(null);

  constructor() { 


    if (!WebsocketService.Socket) {
      WebsocketService.Socket = io(environment.services.brain_connector, { transports: ['websocket'] });
      
      WebsocketService.Socket.on(SocketFunction.Disconnect, (reason) => {
        if (reason === 'io server disconnect') {
          WebsocketService.Socket.connect();
        }
        WebsocketService.WebsocketStatus = SocketStatus.disconnected;
        this.droneEvents$.next(new DroneNotification(null, DroneConnectionStatus.disconnected, "Déconnecté du relai" , NotificationType.error))
        this.socketEvents$.next(new WebSocketNotification(`̀Déconnecté car ${reason}`, NotificationType.error))
      });

      WebsocketService.Socket.on(SocketFunction.Connect, () => {
        WebsocketService.Socket.emit(SocketFunction.IdentifyOperator);

        WebsocketService.WebsocketStatus = SocketStatus.connected;
        this.socketEvents$.next(new WebSocketNotification("Connexion établie", NotificationType.success))
        this.droneEvents$.next(new DroneNotification(null, DroneConnectionStatus.connecting, "En attente de réponse", NotificationType.error))
      });


      WebsocketService.Socket.on(SocketFunction.Connecting, () => {

        WebsocketService.WebsocketStatus = SocketStatus.connecting;
        this.socketEvents$.next(new WebSocketNotification("Connexion en cours", NotificationType.info))
        this.droneEvents$.next(new DroneNotification(null, DroneConnectionStatus.disconnected, "Connexion au relai", NotificationType.error))
      });


      WebsocketService.Socket.on(SocketFunction.Reconnect, () => {
        WebsocketService.WebsocketStatus = SocketStatus.connected;
        this.socketEvents$.next(new WebSocketNotification("Connexion établie",NotificationType.success))
      });

      WebsocketService.Socket.on(SocketFunction.Reconnecting, () => {
        
        WebsocketService.WebsocketStatus = SocketStatus.connecting;
        this.socketEvents$.next(new WebSocketNotification("Reconnexion en cours", NotificationType.info))
        this.droneEvents$.next(new DroneNotification(null, DroneConnectionStatus.disconnected, "Relai injoignable", NotificationType.error))
      });


      WebsocketService.Socket.on(SocketFunction.OnError, () => {
        WebsocketService.WebsocketStatus = SocketStatus.disconnected;
        this.socketEvents$.next(new WebSocketNotification("Impossible de se connecter au service", NotificationType.error))
        this.droneEvents$.next(new DroneNotification(null, DroneConnectionStatus.disconnected, "Relai injoignable", NotificationType.error))
      })

      WebsocketService.Socket.on(SocketFunction.OnReconnectError, () => {
        WebsocketService.WebsocketStatus = SocketStatus.disconnected;
        this.socketEvents$.next(new WebSocketNotification("Echec de la reconnexion", NotificationType.error))
        this.droneEvents$.next(new DroneNotification(null, DroneConnectionStatus.disconnected, "Relai injoignable", NotificationType.error))
      })

      WebsocketService.Socket.on(MyListeners.OnUpdatedPosition, (newPosition: DroneCoordinates) => {
        this.positionUpdate$.next(newPosition)
      })

      WebsocketService.Socket.on(MyListeners.OnInternalChange, (data ) => {
        try {
          let status = data as DroneInternalStatusNotification
          this.internalStatusUpdate$.next(status);
        } catch(error) {
          
        }
      })

      WebsocketService.Socket.on(MyListeners.OnPyDroneAcknowledge, (identification: DroneIdentifier) => {
        this.clearTimer(identification.name)
        this.droneEvents$.next(new DroneNotification(identification.name, DroneConnectionStatus.connected, "Réponse obtenue", NotificationType.success))
      })


      WebsocketService.Socket.on(MyListeners.OnIdentifiedDrone, (identification: IdentificationRequest) => {
        this.clearTimer(identification.name)
        this.droneEvents$.next(new DroneNotification(identification.name, DroneConnectionStatus.connected, "Drone identifié", NotificationType.success))
      })

      WebsocketService.Socket.on(MyListeners.OnDroneDiscovery, (identification: DroneIdentifier) => {
        this.droneEvents$.next(new DroneNotification(identification.name, DroneConnectionStatus.connecting, "En attente de réponse", NotificationType.success))
        this.clearTimer(identification.name)
        WebsocketService.MyTimers.set(identification.name,setTimeout(()=>{    
          this.droneEvents$.next(new DroneNotification(identification.name, DroneConnectionStatus.disconnected, "Aucune réponse", NotificationType.error))
        }, 5000));
      })

      WebsocketService.Socket.on(MyListeners.OnDroneDisconnect, (identification: DroneIdentifier) => {
        this.droneEvents$.next(new DroneNotification(identification.name, DroneConnectionStatus.disconnected, "Drone déconnecté", NotificationType.error))
      })

      WebsocketService.Socket.on(MyListeners.OnAutomatonChange, (identification: DroneIdentifier) => {
        this.statusUpdate$.next(identification)
      })

      WebsocketService.Socket.on(MyListeners.OnExternalModuleChange, (identification: DroneIdentifier) => {
        this.externalModuleStatusUpdate$.next(identification)
      })

      WebsocketService.Socket.on(MyListeners.OnOperatorChange, () => {
        this.operatorUpdate$.next(true)
      })

      WebsocketService.Socket.on(MyListeners.OnScheduleUpdate, (update : DroneFlightCoordinates) => {
        this.autopilotUpdate$.next(update)
      })

      WebsocketService.Socket.on(MyListeners.OnAutopilotUpdate, (update : SchedulerSummarizedData) => {
        this.autopilotStatusUpdate$.next(update)
      })

      WebsocketService.Socket.on(MyListeners.OnFlyingStatusUpdate, (update : DroneSummarizedStatus) => {
        this.flyingStatusUpdate$.next(update)
      })


      WebsocketService.Socket.on(MyListeners.OnTargetRecalculated, (update : SimplifiedDroneFlightCoordinates) => {
        this.targetUpdate$.next(update)
      })
     
     
    }
  }


  public sendCommand(drone: string, key: number){
    WebsocketService.Socket.emit("key_pressed", {"drone_id":drone, "key_pressed": key});
  }

  public authenticate(name: string){
    WebsocketService.Socket.emit(SocketFunction.Authenticate, {"name":name});
  }

  public releaseControls(){
    WebsocketService.Socket.emit(SocketFunction.ReleaseControls, {});
    }
  // System[system], SubSystem[subsystem]
  public restartModuleRequest(system: string, subsystem: string){
    WebsocketService.Socket.emit(SocketFunction.RequestModuleRestart, {"system": system, "subsystem": subsystem});
  }

}

