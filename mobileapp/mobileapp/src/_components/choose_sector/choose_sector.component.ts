import { Component, OnInit, Input } from '@angular/core'
import { User } from '../../_models/index'
import { UserService } from '../../_services/index'
import { ToastController } from 'ionic-angular'

@Component({
    selector: 'choose-sector',
    templateUrl: 'choose_sector.component.html'
})

export class ChooseSectorComponent {
    user: User; // L'utilisateur connecté
    selectedSector:number = 0 // L'ID du secteur où travaille l'utilisateur

    constructor(
      private userService: UserService,
      private toastCtrl: ToastController
    ){}

    ngOnInit() {
      // On récupère les informations de l'utilisateur connecté
      this.userService.getConnectedUser()
      .subscribe((user: User) => {
        this.user = user;
      })
      // On récupère l'ID du secteur dans lequel il travaille
      this.selectedSector = localStorage["sector"]
    }

    // Méthode appelée lors du changement de secteur
    change(pk: number){
      // On stock l'ID du nouveau secteur en local storage
      localStorage["sector"] = pk
      // On affiche un message
      this.toastCtrl.create({
        message: 'Vous avez choisi un secteur !',
        duration: 3000,
        position: 'bottom',
        cssClass: 'success'
      }).present()
    }
}
