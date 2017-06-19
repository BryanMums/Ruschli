import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Resident } from '../../_models/index';
import { ResidentService } from '../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'residents.component.html',
})

export class ResidentsComponent implements OnInit {
    residents: Resident[] = [];
    tabSort: any[] = [];
    selectedSort: number = 0;

    constructor(private residentService: ResidentService, private router: Router) {
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
            });
    }

    onSelect(resident: Resident) {
      this.router.navigate(['/resident', resident.pk])
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

    test(lol:any){
      console.log(lol)
    }
}
