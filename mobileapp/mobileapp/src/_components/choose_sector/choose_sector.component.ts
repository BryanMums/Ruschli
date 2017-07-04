import { Component, OnInit, Input } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import {IMyDpOptions, IMyDateModel, IMyDate} from 'mydatepicker';

import { ToastController } from 'ionic-angular';

@Component({
    selector: 'choose-sector',
    templateUrl: 'choose_sector.component.html'
})

export class ChooseSectorComponent {
    user: User;
    selectedSector:number = 0

    constructor(private userService: UserService, private toastCtrl: ToastController){}

    ngOnInit() {
      this.userService.getConnectedUser()
      .subscribe((user: User) => {
        this.user = user;
      })
      this.selectedSector = localStorage["sector"]
    }

    change(pk: number){
      localStorage["sector"] = pk
      let toast = this.toastCtrl.create({
        message: 'Vous avez choisi un secteur !',
        duration: 3000,
        position: 'bottom',
        cssClass: 'success'
      });

      toast.present();
      localStorage["sector"] = pk
    }


}
