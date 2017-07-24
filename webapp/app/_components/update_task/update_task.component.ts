import { Component, OnInit, Input } from '@angular/core'
import { TaskDate } from '../../_models/index'
import { TaskService } from '../../_services/index'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
    selector: 'update-task',
    moduleId: module.id,
    templateUrl: 'update_task.component.html'
})

export class UpdateTaskComponent implements OnInit{
  private taskDate: TaskDate = null
  private state = 0
  private onlyAtDate = false
  private date:any = null
  private taskToAdd = false
  public myForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
  ){}

  ngOnInit(){
      // Permet de récupérer la tâche et la date
      this.route.params.subscribe(params => {
        this.date = params['date']
        this.taskService.getTaskDate(params['id'])
          .subscribe((taskDate: TaskDate) => {
            this.taskDate = taskDate
            // On va regarder si c'est une exception ou une tâche périodique
            if((taskDate.eventType == 0 && taskDate.parent != null) || taskDate.eventType == 1){
              // Il faudra choisir entre 2 choix dans le formulaire (Qu'à la date ou à partir de la date)
              console.log("ahah")
              this.myForm = this._fb.group({
                type: ['', Validators.required]
              })
              console.log("hihi")
              this.state = 1
            // Si c'est une tâche non-périodique
            }else{
              console.log("mdr")
              this.state = 2
            }
          })
        }
  }

  // Méthode appelée dans le cas d'une tâche périodique ou exception.
  chooseTypeModif(model: any, isValid:boolean){
    // Si on choisit de modifier uniquement à la date
    if(model["type"] == 0){
      this.onlyAtDate = true
    }
    this.state = 2
  }

  reset(){
    // Revenir sur la page de la tâche
  }

}
