# locuste.dashboard.ui
LOCUSTE : Interface graphique ANGULAR 

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4ee69cbcd86c459ba377c2c4c6d916ee)](https://www.codacy.com/manual/axel.maciejewski/locuste.dashboard.ui?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DaemonToolz/locuste.dashboard.ui&amp;utm_campaign=Badge_Grade)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=alert_status)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=security_rating)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=bugs)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DaemonToolz_locuste.dashboard.ui&metric=coverage)](https://sonarcloud.io/dashboard?id=DaemonToolz_locuste.dashboard.ui)

<img width="2629" alt="locuste-web-banner" src="https://user-images.githubusercontent.com/6602774/84284573-ab62fc80-ab3c-11ea-8260-0866505bcea3.png">

Le project Locuste se divise en 4 grandes sections : 
* Automate (Drone Automata) PYTHON (https://github.com/DaemonToolz/locuste.drone.automata)
* Unité de contrôle (Brain) GOLANG (https://github.com/DaemonToolz/locuste.service.brain)
* Unité de planification de vol / Ordonanceur (Scheduler) GOLANG (https://github.com/DaemonToolz/locuste.service.osm)
* Interface graphique (UI) ANGULAR (https://github.com/DaemonToolz/locuste.dashboard.ui)

![Composants](https://user-images.githubusercontent.com/6602774/83644711-dcc65000-a5b1-11ea-8661-977931bb6a9c.png)

Tout le système est embarqué sur une carte Raspberry PI 4B+, Raspbian BUSTER.
* Golang 1.11.2
* Angular 9
* Python 3.7
* Dépendance forte avec la SDK OLYMPE PARROT : (https://developer.parrot.com/docs/olympe/, https://github.com/Parrot-Developers/olympe)

![Vue globale](https://user-images.githubusercontent.com/6602774/83644783-f10a4d00-a5b1-11ea-8fed-80c3b76f1b00.png)

Détail des choix techniques pour la partie Interface Graphique :

* [Angular] - Exposer et envoyer rapidement une application web qui intègre toutes les composantes de sécurité
* [SocketIO] - Elément facile intégré avec Angular, Node et Python (temps-réel)

Temps entre l'acquisition de la touche et l'interprétation : quasi-instantanée (< 50ms, mesures plus précises requises)

Evolutions à venir : 
* Refactoring global et nettoyage de code
* Réintégration des commandes
* Mise à jour tutoriel et icônes
* Amélioration du profil opérateur
* Amélioration des performances
* Intégration de tests
