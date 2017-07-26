import { Component, OnInit, Input } from '@angular/core'
import { TaskDate } from '../../_models/index'
import { TaskService } from '../../_services/index'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { NavController, NavParams, ToastController } from 'ionic-angular'
import { UpdateTaskComponent } from '../update_task/index'
import { StopTaskComponent } from '../stop_task/index'


@Component({
    selector: 'task-detail',
    templateUrl: 'task_detail.component.html'
})

export class TaskDetailComponent implements OnInit {
    @Input() date: any
    @Input() taskDate: TaskDate

    can_update = false
    can_take = false
    can_comment = false

    repetition: String = ""
    parent: TaskDate = null
    public myForm: FormGroup

    days: string  [] = [
        'Lundi. ',
        'Mardi. ' ,
        'Mercredi. ',
        'Jeudi. ' ,
        'Vendredi. ',
        'Samedi. ' ,
        'Dimanche. '
    ]

    // Options pour le choix de quelle semaine
    weekNumber: string[] = [
        'Premier',
        'Deuxième',
        'Troisième',
        'Quatrième',
        'Cinquième'
    ]

    constructor(
      private taskService: TaskService,
      private _fb: FormBuilder,
      private navParams: NavParams,
      public navCtrl: NavController,
      private toastCtrl: ToastController,
    ) { }

    ngOnInit() {
      // On récupère le résident selon l'id
      this.myForm = this._fb.group({
          text: ['', Validators.required]
        })
      // On récupère la tâche et la date
      let pk = this.navParams.get("taskDate")
      this.date = this.navParams.get("date")
      this.taskService.getTaskDate_date(pk, this.date)
      .subscribe((taskDate: TaskDate) => {
        this.taskDate = taskDate
        if(this.taskDate.parent != null){
          this.taskService.getTaskDate(this.taskDate.parent)
            .subscribe((parent: TaskDate) => {
              this.parent = parent
              this.initPeriodicity()
              this.taskService.getPermissions(taskDate.pk)
                .subscribe((data: any) => {
                  this.can_take = data.can_take
                  this.can_update = data.can_update
                  this.can_comment = data.can_comment
                })
            },
          err => {
            this.toastCtrl.create({
              message: 'Une erreur s\'est produite !',
              duration: 3000,
              position: 'bottom',
              cssClass: 'error'
            }).present()
            this.navCtrl.pop()
          })
        }else{
          this.initPeriodicity()
          this.taskService.getPermissions(taskDate.pk)
            .subscribe((data: any) => {
              this.can_take = data.can_take
              this.can_update = data.can_update
              this.can_comment = data.can_comment
            })
        }

      },
    err => {
      this.toastCtrl.create({
        message: 'Une erreur s\'est produite !',
        duration: 3000,
        position: 'bottom',
        cssClass: 'error'
      }).present()
      this.navCtrl.pop()
    })
    }

    // Méthode permettant d'ajouter un commentaire
    addComment(model: any, isValid: Boolean){
      if(isValid){
        // On prépare les données à envoyer
        let data = {}
        data["text"] = model.text
        data["date"] = this.date
        data["taskdate"] = this.taskDate.pk
        // On envoie à l'API le commentaire
        this.taskService.addComment(data)
          .subscribe(taskDate => {
            if(taskDate.pk != null){
              // On met à jour la tâche
              this.taskDate = taskDate
              this.toastCtrl.create({
                message: 'Votre commentaire a bien été enregistré !',
                duration: 3000,
                position: 'bottom',
                cssClass: 'success'
              }).present()
              // On remet le formulaire à 0
              this.myForm = this._fb.group({
                  text: ['', Validators.required]
                })
            }else{
              this.toastCtrl.create({
                message: 'Votre commentaire n\'a pas pu être envoyé !',
                duration: 3000,
                position: 'bottom',
                cssClass: 'error'
              }).present()
            }
          })
      }
    }

    // Méthode permettant de prendre en charge une tâche
    take(){
        // On prépare les données à envoyer à l'API
        let data = {}
        data["sector"] = localStorage["sector"]
        data["taskdate"] = this.taskDate.pk
        data["date"] = this.date
        // On envoie à l'API pour dire que l'utilisateur s'occupe de la tâche
        this.taskService.addTaker(data)
          .subscribe(taskDate => {
            if(taskDate.pk != null){
              // On met à jour les infos de la tâche
              this.taskDate = taskDate
              this.toastCtrl.create({
                message: 'Vous vous occupez de cette tâche !',
                duration: 3000,
                position: 'bottom',
                cssClass: 'success'
              }).present()
            }else{
              this.toastCtrl.create({
                message: 'Une erreur s\'est produite !',
                duration: 3000,
                position: 'bottom',
                cssClass: 'error'
              }).present()
            }
          })
    }

    // Méthode appelée pour permettre la modification
    openModif(){
      // On affiche la page de modification d'une tâche
      this.navCtrl.push(UpdateTaskComponent, {pk: this.taskDate.pk, date: this.date})
    }

    // Méthode appelée pour permettre d'arrêter la tâche
    openStop(){
      // On affiche la page d'arrêt d'une tâche
      this.navCtrl.push(StopTaskComponent, {pk: this.taskDate.pk, date: this.date})
    }

    // Méthode appelée pour permettre de réactiver la tâche
    reactivate(){
      this.taskService.activateTaskDate(this.taskDate.pk, this.date)
      .subscribe(
        response => {
          this.toastCtrl.create({
            message: 'La tâche a bien été réactivée !',
            duration: 3000,
            position: 'bottom',
            cssClass: 'success'
          }).present();
          this.navCtrl.pop()
      },
        err => {
          this.toastCtrl.create({
            message: 'La tâche n\'a pas pu être réactivée !',
            duration: 3000,
            position: 'bottom',
            cssClass: 'error'
          }).present();
        })
    }


      translatePeriodicity(taskDate){
        if(taskDate.eventType == 0){
          this.repetition += "Tâche non périodique. "
        }else{
          this.repetition += "Tâche périodique "
          if(taskDate.periodicType == 0){
            this.repetition += "quotidienne. "
          }else if(taskDate.periodicType == 1){
            this.repetition += "hebdomadaire. "
            let that = this
            taskDate.daysOfWeek.forEach(function(day){
              that.repetition += that.days[day]
            })
            this.repetition += "Tous les "+(taskDate.intervalWeek > 1 ? taskDate.intervalWeek : '') + " semaines."
          }else if(taskDate.periodicType == 2){
            this.repetition += "mensuelle. "
            if(taskDate.monthlyType == 0){
              this.repetition += "Tous les "+taskDate.dayNumber+" du mois. "
            }else{
              let that = this
              taskDate.daysOfWeek.forEach(function(day){
                that.repetition += that.days[day]
              })
              this.repetition += that.weekNumber[taskDate.weekNumber]+ " du mois. "
            }
            this.repetition += "Tous les "+(taskDate.intervalMonth > 1 ? taskDate.intervalMonth : '') + " mois."
          }else{
            this.repetition += "annuelle. "
          }
        }

        if(taskDate.eventType == 1){
          this.repetition += "Date de début : "+taskDate.start_date+". "
          if(taskDate.end_date){
            this.repetition += "Date de fin : "+taskDate.end_date+ ". "
          }
        }
      }

      initPeriodicity(){
        // Si c'est une apparition exception, il faudra prendre celle de son parent
        if(this.taskDate.eventType == 0 && this.parent != null){
          this.translatePeriodicity(this.parent)
        }else{
          this.translatePeriodicity(this.taskDate)
        }
      }
}
