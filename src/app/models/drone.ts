

export class Drone {
    public ip_address: string; 
}

export class DroneIdentifier {
    public name : string;
}


export class DroneInternalStatus {
    public battery: number;
}

export class IdentificationRequest {
	public name : string;
	public video_port : number;
	public ip: string 
	public connected :  boolean;
	public manual: boolean;
	public sim: boolean;
    public position : any;
}

export class DroneStatus {
    public available: boolean;
	public on_error:boolean;
    public ongoing: boolean;
    public initialized: boolean;
    public connected: boolean;
    public manual: boolean;
    public sim: boolean;
}

export enum StatusToReadable{
    available = "Automate disponible",
    on_error = "Séquence d'erreur de l'automate active",
    ongoing = "Automate en cours d'exécution",
    initialized = "Automate initialisé",
    connected = "Automate connecté au drone",
    manual = "Pilotage en mode manuel",
    sim = "Mode simulation / maintenance"
}

export enum InternalStatuses{
    BatteryStateChanged = "Batterie (%)",
    numberOfSatelliteChanged = "Nombre de satellites",
    rssi_changed = "Force du signal (dbm)",
}

export enum BatteryStatus{
    high,
    medium,
    low,
    critical
}

export enum GPSStatus{
    ready,
    unavailable,
    not_registered
}

export enum WifiStatus{
    ready,
    unavailable
}


export enum GPSStrength{
    high,
    medium,
    low
}

export enum WifiStrength{
    excellent,
    high,
    medium,
    low,
    unavailable
}