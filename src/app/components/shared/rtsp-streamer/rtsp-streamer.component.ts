import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import {SocketFunction} from '../../../models/sockets'
import * as io from 'socket.io-client';
import { DroneDataService } from 'src/app/services/drone/drone-data.service';

@Component({
  selector: 'app-rtsp-streamer',
  templateUrl: './rtsp-streamer.component.html',
  styleUrls: ['./rtsp-streamer.component.scss']
})

export class RtspStreamerComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('streaming') public streamingcanvas: ElementRef;

  @Input() public width: number
  @Input() public height: number
  @Input() public drone: string;
  
  private player: any


  constructor() { 

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
  }


  ngAfterViewInit() {
    let my_ip = this.drone.split("_")[1];
    let target_port = my_ip.split(".")[2]; 
    this.player = new JSMpeg.Player(`ws://192.168.1.66:70${target_port}`, {
      canvas: this.streamingcanvas.nativeElement // Canvas should be a canvas DOM element
    })	

  }

}
