import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DroneConsoleComponent } from './components/drone-console/drone-console.component';
import { DronePreviewComponent } from './components/drone-preview/drone-preview.component';

import {MatToolbarModule} from "@angular/material/toolbar"
import {MatIconModule} from "@angular/material/icon"
import {MatCardModule} from "@angular/material/card"
import {MatButtonModule} from "@angular/material/button"
import {MatGridListModule} from "@angular/material/grid-list"
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner"
import {MatProgressBarModule} from "@angular/material/progress-bar"
import {MatTooltipModule} from "@angular/material/tooltip"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {MatBadgeModule} from "@angular/material/badge"
import {MatTabsModule} from "@angular/material/tabs"
import {MatTableModule} from "@angular/material/table"
import {MatSliderModule} from "@angular/material/slider"
import {MatListModule} from "@angular/material/list"

import { FormsModule } from '@angular/forms';
import { MatDialogModule} from '@angular/material/dialog'
import { HttpClientModule } from '@angular/common/http';
import { DroneDiscoveryService } from './services/Info/drone-discovery.service';
import { WebsocketService } from './services/websocket.service';

import {AppRoutingModule} from "./app-routing.module";
import { RtspStreamerComponent } from './components/shared/rtsp-streamer/rtsp-streamer.component';
import { ControlTutorialDialogComponent } from './components/tutorial/control-tutorial-dialog/control-tutorial-dialog.component';
import { RelayMonitoringComponent } from './components/relay-monitoring/relay-monitoring.component'
import { DroneDataService } from './services/drone/drone-data.service';
import { PingService } from './services/ping/ping.service';
import { OperatorService } from './services/users/operator.service';
import { IdentificationPortalComponent } from './components/shared/identification-portal/identification-portal.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DroneMapComponent } from './components/shared/map/drone-map/drone-map.component';
import { CityMapComponent } from './components/map/city-map/city-map.component';
import { DroneStatusDetailComponent } from './components/shared/drone-status-detail/drone-status-detail.component';
import { HelpMeComponent } from './components/shared/help-me/help-me.component';
import { DroneConsoleSettingsComponent } from './components/shared/drone-console-settings/drone-console-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    DroneConsoleComponent,
    DronePreviewComponent,
    RtspStreamerComponent,
    ControlTutorialDialogComponent,
    RelayMonitoringComponent,
    IdentificationPortalComponent,
    DroneMapComponent,
    CityMapComponent,
    DroneStatusDetailComponent,
    HelpMeComponent,
    DroneConsoleSettingsComponent
  ],
  entryComponents:[
    ControlTutorialDialogComponent,
    IdentificationPortalComponent,
    DroneStatusDetailComponent,
    DroneConsoleSettingsComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,MatDialogModule,
    HttpClientModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    MatListModule,
    MatSliderModule,
    MatBadgeModule,
    FormsModule,
    MatFormFieldModule,

    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    MatCardModule
  ],
  providers: [DroneDiscoveryService, WebsocketService, DroneDataService, PingService, OperatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
