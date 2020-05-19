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


Le project Locuste se divise en 3 grandes sections : 
* Automate (Drone Automata) PYTHON
* Unité de contrôle (Brain) GOLANG
* Unité de planification de vol / Ordonanceur (Scheduler) GOLANG
* Interface graphique (UI) ANGULAR


![Composants](https://user-images.githubusercontent.com/6602774/82243830-8960ca80-9940-11ea-917e-15585f178c6d.png)

Tout le système est embarqué sur une carte Raspberry PI 4B+, Raspbian BUSTER.
* Golang 1.11.2
* Angular 9
* Python 3.7
* Dépendance forte avec la SDK OLYMPE PARROT : (https://developer.parrot.com/docs/olympe/, https://github.com/Parrot-Developers/olympe)


![Vue globale](https://user-images.githubusercontent.com/6602774/82240232-59162d80-993a-11ea-8f8e-c7d3cfde2a7c.png)


Détail des choix techniques pour la partie Interface Graphique :

* [Angular] - Exposer et envoyer rapidement une application web qui intègre toutes les composantes de sécurité
* [SocketIO] - Elément facile intégré avec Angular, Node et Python (temps-réel)

Evolutions à venir : 
* Refactoring global et nettoyage de code
* Réintégration des commandes
* Mise à jour tutoriel et icônes
* Amélioration du profil opérateur
* Amélioration des performances
