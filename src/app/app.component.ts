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
import { HelpMeComponent } from './components/shared/help-me/help-me.component';
import { PcToHubStatus, HubToAutomatonStatus, HubStatus, AutomatonStatus, SocketStatus } from './models/status';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public title : string = 'Locuste Web Controller';
  public myStatus : WebSocketNotification;
  private notifications : Subscription;

  public SocketStatus = SocketStatus;
  public PcToHubStatus = PcToHubStatus;
  public HubToAutomatonStatus = HubToAutomatonStatus;
  public HubStatus = HubStatus;
  public AutomatonStatus = AutomatonStatus;

  public readonly NotificationType = NotificationType

  constructor(private matIconRegistry: MatIconRegistry, private pingService :PingService,  private dialog: MatDialog, private domSanitizer: DomSanitizer, private connector: WebsocketService, private operatorService: OperatorService){
    this.matIconRegistry.addSvgIcon(`drone_icon`,this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/drone.svg`));
    this.matIconRegistry.addSvgIcon(`locuste_pydrone`,this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/locuste_pydrone_icon.svg`));
    this.matIconRegistry.addSvgIcon(`locuste_icon`,this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/locuste_icon.svg`));
    
    this.matIconRegistry.addSvgIcon(`map_ready`,this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/map_ready.svg`));
    this.matIconRegistry.addSvgIcon(`map_not_ready`,this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/map_not_ready.svg`));

    this.matIconRegistry.addSvgIcon(`error_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/error_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`error_hub_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/error_hub_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`error_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/error_hub.svg`));
    this.matIconRegistry.addSvgIcon(`error_pc`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/error_pc.svg`));
    this.matIconRegistry.addSvgIcon(`error_pc_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/error_pc_hub.svg`));
    this.matIconRegistry.addSvgIcon(`error_video_server`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/error_video_server.svg`));

    this.matIconRegistry.addSvgIcon(`info_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/info_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`info_hub_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/info_hub_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`info_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/info_hub.svg`));
    this.matIconRegistry.addSvgIcon(`info_pc`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/info_pc.svg`));
    this.matIconRegistry.addSvgIcon(`info_pc_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/info_pc_hub.svg`));
    this.matIconRegistry.addSvgIcon(`info_video_server`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/info_video_server.svg`));

    this.matIconRegistry.addSvgIcon(`success_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/success_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`success_hub_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/success_hub_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`success_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/success_hub.svg`));
    this.matIconRegistry.addSvgIcon(`success_pc`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/success_pc.svg`));
    this.matIconRegistry.addSvgIcon(`success_pc_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/success_pc_hub.svg`));
    this.matIconRegistry.addSvgIcon(`success_video_server`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/success_video_server.svg`));


    this.matIconRegistry.addSvgIcon(`warn_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/warn_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`warn_hub_automaton`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/warn_hub_automaton.svg`));
    this.matIconRegistry.addSvgIcon(`warn_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/warn_hub.svg`));
    this.matIconRegistry.addSvgIcon(`warn_pc`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/warn_pc.svg`));
    this.matIconRegistry.addSvgIcon(`warn_pc_hub`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/warn_pc_hub.svg`));
    this.matIconRegistry.addSvgIcon(`warn_video_server`, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/warn_video_server.svg`));



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


  public get socketConnection(){
    return this.connector.websocketStatus;
  }

  public showHelp(){
    this.dialog.open(HelpMeComponent, {
      width: '75%',
      height: '75%'
    });

  }

}
