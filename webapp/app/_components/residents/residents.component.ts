import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Resident } from '../../_models/index'
import { ResidentService } from '../../_services/index'

@Component({
    moduleId: module.id,
    templateUrl: 'residents.component.html',
})

export class ResidentsComponent implements OnInit {
    residents: Resident[] = [] // Liste des résidents
    tabSort: any[] = [] // Liste des choix de tri
    selectedSort: number = 0 // L'ID du tri sélectionné par défaut

    constructor(
      private residentService: ResidentService,
      private router: Router
    ) {
      // Configuration des différents choix de tri
      this.tabSort[0] = ['Prénom (croissant)','firstname', -1]
      this.tabSort[1] = ['Prénom (décroissant)','firstname', 1]
      this.tabSort[2] = ['Nom (croissant)','lastname', -1]
      this.tabSort[3] = ['Nom (décroissant)','lastname', 1]
    }

    ngOnInit() {
      this.updateList()
    }
    // Méthode appelée quand on clique sur un résident
    onSelect(resident: Resident) {
      // On affiche la page du résident
      this.router.navigate(['/resident', resident.pk])
    }

    // Méthode permettant de trier le tableau
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
    }

    // Méthode permettant de mettre à jour la liste des résidents
    updateList(){
      this.residentService.getResidents()
          .subscribe(residents => {
              this.residents = residents;
              this.onSort(this.selectedSort)
          });
    }
}
