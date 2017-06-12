import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import {IMyDpOptions, IMyDateModel, IMyDate} from 'mydatepicker';

@Component({
    selector: 'choose-sector',
    moduleId: module.id,
    templateUrl: 'choose_sector.component.html'
})

export class ChooseSectorComponent {
    user: User;

    constructor(private userService: UserService ,private router: Router){}

    ngOnInit() {
      this.userService.getConnectedUser()
      .subscribe((user: User) => {
        this.user = user;
      })
    }

    change(pk: number){
      console.log("fiesjfioejnsiofs"+pk)
      localStorage["sector"] = pk
      this.router.navigate(['/'])
    }


}
