import { Component, OnInit, Input } from '@angular/core';
import { User, TaskDate } from '../../_models/index';
import { UserService, TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'angular2-toaster'

@Component({
    selector: 'stop-task',
    moduleId: module.id,
    templateUrl: 'stop_task.component.html'
})

export class StopTaskComponent implements OnInit{
  taskDate: TaskDate = null
  s = 0
  onlyAtDate = false
  date:any = null
  taskToAdd = false
  included_date = false

  public myForm: FormGroup

  constructor(
    private TaskService: TaskService,
    private _fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService
  ){}

  ngOnInit(){
    this.route.params.subscribe(params => {
     this.date = params['date']
     this.taskService.getTaskDate_date(+params['id'], this.date)
     .subscribe((taskDate: TaskDate) => {
       this.taskDate = taskDate
       this.taskService.getPermissions(this.taskDate.pk)
        .subscribe((data) => {
          if(data.can_update == false){
            // Redirige l'utilisateur sur la page de tâche.

          }
        })
     })
   })
  }

  reset(){
    // Rediriger sur la page de la tâche
    this.router.navigate(['/task', this.taskDate.pk, this.date])
  }

  stop(){
    // On va préparer les données à envoyer selon les choix de l'utilisateur
    let data = {}
    data["taskdate"] = this.taskDate.pk
    data["type"] = this.onlyAtDate
    data["includeDate"] = this.included_date
    data["date"] = this.date

    // On arrête la tâche
    this.taskService.stopTaskDate(data)
    .subscribe(
      response => {
        this.router.navigate(['home', this.date])
        // On va revenir sur la liste des tâches à la bonne date

    },
      err => {

      }
  )
  }
}
