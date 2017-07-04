import { Component, OnInit } from '@angular/core';
import { Resident } from '../../_models/index';
import { ResidentComponent } from '../resident/index';
import { ResidentService } from '../../_services/index';
import {Storage} from "@ionic/storage";
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'residents.component.html',
})

export class ResidentsComponent implements OnInit {
    residents: Resident[] = [];
    tests: any[] = ["Test1", "Test2", "Test3"]
    tabSort: any[] = [];
    selectedSort: number = 0;

    constructor(private residentService: ResidentService, public navCtrl: NavController) {
        this.tabSort[0] = ['Prénom (croissant)','firstname', 1]
        this.tabSort[1] = ['Prénom (décroissant)','firstname', -1]
        this.tabSort[2] = ['Nom (croissant)','lastname', 1]
        this.tabSort[3] = ['Nom (décroissant)','lastname', -1]


    }

    ngOnInit() {
        // get residents from secure api end point
        this.residentService.getResidents()
            .subscribe(residents => {
                this.residents = residents;
                this.onSort(this.selectedSort)
                console.log(this.residents)
            });
    }

    onSelect(resident: Resident) {
      //this.router.navigate(['/resident', resident.pk])
      console.log("ouiii")
      this.navCtrl.push(ResidentComponent, {id: resident.pk})
    }

    onSort(index:number){
      let param = this.tabSort[index][1]
      let value = this.tabSort[index][2]
      this.residents.sort(function(res1, res2){
        if(res1[param] > res2[param]){
          return -1 * parseInt(value);
        }else if(res1[param] < res2[param]){
          return 1 * parseInt(value);
        }else{
          return 0;
        }
      })
      console.log(this.residents)
    }

    test(lol:any, lel:any){
      console.log(lol, lel)
    }
}
