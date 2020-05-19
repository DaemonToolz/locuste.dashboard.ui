import { Component, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DroneDiscoveryService } from './services/Info/drone-discovery.service';
import { take } from "rxjs/operators"
import { Drone } from './models/drone';
import { WebsocketService } from './services/websocket.service';
import { Subscription, } from 'rxjs';
import { WebSocketNotification, NotificationType } from './models/notifications';
import { OperatorService } from './services/users/operator.service';
import { Operator } from './models/operator';
import { MatDialog } from '@angular/material/dialog';
import { IdentificationPortalComponent } from './components/shared/identification-portal/identification-portal.component';
import { PingService } from './services/ping/ping.service';
import { System, SubSystem } from './models/health';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public title : string = 'Locuste Web Controller';
  public myStatus : WebSocketNotification;
  private notifications : Subscription;

  public readonly NotificationType = NotificationType

  constructor(private matIconRegistry: MatIconRegistry, private pingService :PingService,  private dialog: MatDialog, private domSanitizer: DomSanitizer,  connector: WebsocketService, private operatorService: OperatorService){
    this.matIconRegistry.addSvgIcon(`drone_icon`,this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/drone.svg`));
    this.myStatus = new WebSocketNotification("Déconnecté du relai", NotificationType.error);
    
    this.notifications = connector.socketEvents$.subscribe(event => {
      if(event != null){
        this.myStatus = event;
      }
    })
  }

  ngOnDestroy(): void {
    this.notifications.unsubscribe();
  }

  public get isRelayReachable(): boolean {
    return this.pingService.isRelayReachable
  }


  public get isMapModuleOperational(): boolean {
    if(!this.pingService.healthMonitor.has("Scheduler")) return false;
    if(!this.pingService.healthMonitor.get("Scheduler").has("MapHandler")) return false;
    return this.pingService.healthMonitor.get("Scheduler").get("MapHandler")
  }

  public get myself(): Operator{
    return this.operatorService.myself
  }

  public authenticate(){
    if(this.operatorService.myself != null && this.operatorService.myself.name.length > 0){
      const dialogRef = this.dialog.open(IdentificationPortalComponent, {
        width: '50%'
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.operatorService.authenticate(result)
        }
      });
    }
  }

}
