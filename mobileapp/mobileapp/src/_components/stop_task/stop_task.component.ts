import { Component, OnInit, Input } from '@angular/core'
import { User, TaskDate } from '../../_models/index'
import { UserService, TaskService } from '../../_services/index'
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker'
import { NavController, NavParams, ToastController } from 'ionic-angular'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'

@Component({
    selector: 'stop-task',
    templateUrl: 'stop_task.component.html'
})

export class StopTaskComponent implements OnInit{
  taskDate = null
  s = 0
  onlyAtDate = false
  date = null
  taskToAdd = false
  included_date = false

  public myForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private navParams: NavParams,
    public navCtrl: NavController,
    private _fb: FormBuilder,
    private toastCtrl: ToastController,
  ){}

  ngOnInit(){
      let pk = this.navParams.get("pk")
      this.date = this.navParams.get("date")
      this.taskService.getTaskDate_date(pk, this.date)
        .subscribe((taskDate: any) => {
          this.taskDate = taskDate
          })
  }

  reset(){
    this.navCtrl.pop()
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
        this.toastCtrl.create({
          message: 'La tâche a bien été arrêtée !',
          duration: 3000,
          position: 'bottom',
          cssClass: 'success'
        }).present()
        // On va revenir sur la liste des tâches d'où l'utilisateur vient (Accueil ou résident)
        this.navCtrl.pop()
        this.navCtrl.pop()
    },
      err => {
        this.toastCtrl.create({
          message: 'La tâche n\'a pas pu être arrêtée !',
          duration: 3000,
          position: 'bottom',
          cssClass: 'error'
        }).present()
      }
  )
  }

}
