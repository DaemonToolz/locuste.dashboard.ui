# locuste.dashboard.ui
LOCUSTE : Interface graphique ANGULAR 



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
