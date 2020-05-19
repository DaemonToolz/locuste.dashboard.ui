import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DroneConsoleComponent } from './components/drone-console/drone-console.component';
import { DronePreviewComponent } from './components/drone-preview/drone-preview.component';
import { RelayMonitoringComponent } from './components/relay-monitoring/relay-monitoring.component';
import { CityMapComponent } from './components/map/city-map/city-map.component';


const routes: Routes = [
    {path:'monitor', component:RelayMonitoringComponent},
    {path:'map', component:CityMapComponent},
    
    {path:'console/:droneid', component:DroneConsoleComponent},
    {path: '**', component: DronePreviewComponent}
  ];
  
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }