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

    constructor(private residentService: ResidentService, private router: Router) { }

    ngOnInit() {
        // get residents from secure api end point
        this.residentService.getResidents()
            .subscribe(residents => {
                this.residents = residents;
                console.log(this.residents)
            });
    }

    onSelect(resident: Resident) {
      this.router.navigate(['/resident', resident.pk])
    }

    onSort(param:any, value:any){
      console.log(param + " : "+value)
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
}
