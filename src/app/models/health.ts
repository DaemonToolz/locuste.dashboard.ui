export enum System{
    Brain = "Unité de contrôle",
    Scheduler = "Unité de planification",
    External = "Modules externes"
}

export enum SubSystem{
    FileWatcher = "Gestionnaire d'états internes",
    SocketServer = "Serveur WebSocket",
    HttpServer = "Serveur HTTP",
    Runner = "Processus d'exécution",
    SchedulerConnection = "Connexion au planfiicateur",
    RPCServer = "Serveur de communication Inter-processus",
  
    // Section composants dédiés
    VideoServer = "Serveur vidéo",
    VideoStream = "Flux vidéo",
    OrderStream = "Canal d'envoi des ordres",

    // Section Scheduler 
    BrainConnection = "Connexion à l'unité de contrôle",
    MapHandler = "Gestionnaire de cartes",
    FlightManager = "Ordonnanceur de vol"
}

