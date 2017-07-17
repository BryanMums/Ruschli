import { Component, OnInit, Input } from '@angular/core'
import { TaskDate } from '../../_models/index'
import { TaskService } from '../../_services/index'
import { NavController, NavParams } from 'ionic-angular'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'update-task',
    templateUrl: 'update_task.component.html'
})

export class UpdateTaskComponent implements OnInit{
  taskDate = null
  state = 0
  onlyAtDate = false
  date = null
  taskToAdd = false
  public myForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private navParams: NavParams,
    public navCtrl: NavController,
    private _fb: FormBuilder,
  ){}

  ngOnInit(){
      // Permet de récupérer la tâche et la date
      let pk = this.navParams.get("pk")
      this.date = this.navParams.get("date")
      this.taskService.getTaskDate(pk)
        .subscribe((taskDate: TaskDate) => {
          this.taskDate = taskDate
          // On va regarder si c'est une exception ou une tâche périodique
          if((taskDate.eventType == 0 && taskDate.parent != null) || taskDate.eventType == 1){
            // Il faudra choisir entre 2 choix dans le formulaire (Qu'à la date ou à partir de la date)
            this.myForm = this._fb.group({
              type: ['', Validators.required]
            })
            this.state = 1
          // Si c'est une tâche non-périodique
          }else{
            this.state = 2
          }
          })
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
    this.navCtrl.pop()
  }

}
