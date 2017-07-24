import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import {IMyDpOptions, IMyDateModel, IMyDate} from 'mydatepicker';
import { ToasterService } from 'angular2-toaster'

@Component({
    selector: 'choose-sector',
    moduleId: module.id,
    templateUrl: 'choose_sector.component.html'
})

export class ChooseSectorComponent {
    user: User; // L'utilisateur connecté
    selectedSector:number = 1 // L'ID du secteur où travaille l'utilisateur

    constructor(
      private userService: UserService,
      private router: Router,
      private toasterService: ToasterService
    ){}

    ngOnInit() {
      // On récupère les informations de l'utilisateur connecté
      this.userService.getConnectedUser()
      .subscribe((user: User) => {
        this.user = user;
      })
      // On récupère l'ID du secteur dans lequel il travaille
      this.selectedSector = parseInt(localStorage["sector"])
    }

    // Méthode appelée lors du changement de secteur
    change(pk: number){
      // On stock l'ID du nouveau secteur en local storage
      localStorage["sector"] = pk
      // On affiche un message
      this.toasterService.pop('success', 'Choix de secteur', 'Vous avez choisi un secteur !')
    }



}
