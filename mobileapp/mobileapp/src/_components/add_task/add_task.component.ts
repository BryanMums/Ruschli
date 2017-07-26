import { Component, OnInit } from '@angular/core'
import { TaskType } from '../../_models/index'
import { TaskService } from '../../_services/index'
import { Events } from 'ionic-angular';

@Component({
    selector: 'add-task',
    templateUrl: 'add_task.component.html'
})

export class AddTaskComponent implements OnInit {
    private taskTypes : TaskType[] = [] // Liste des types de tâches pouvant être créées
    private state = 1 // Etat de base à 1 --> Choix du type de tâche, 2 --> Formulaire
    private taskType: TaskType = null // Le type de tâche qui sera sélectionné
    private taskToAdd: Boolean = true // Permet de spécifier au formulaire que l'on veut ajouter et non modifier.

    constructor(
      private taskService: TaskService,
      public events: Events
    ) { }

    ngOnInit() {
      // Evénement qui va se produire à la fin de l'ajout
      this.events.subscribe('add', () => {
        this.reset()
        })
    }

    // Méthode appelée lorsqu'on vient sur la page, important !
    ionViewWillEnter() {
      if(this.state == 1){
        // On va récupérer tous les types de tâche
        this.taskService.getTaskTypes()
            .subscribe(
            types  => {
                this.taskTypes = types
            },
            err => {

            })
      }
    }

    // Méthode appelée lors du choix du type de tâche
    chooseType(pk: number){
      // On va récupérer le type
      this.taskService.getTaskType(pk)
        .subscribe(taskType => {
          this.taskType = taskType
          console.log(taskType)
          // On passe à l'étape du formulaire
          this.state = 2
        })
    }

    // Permet de revenir à l'étape du choix de type
    reset(){
      this.state = 1
    }


}
