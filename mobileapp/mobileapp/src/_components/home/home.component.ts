import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskDate } from '../../_models/index';
import { TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { TaskDetailComponent } from '../task_detail/index'

@Component({
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    tasks: TaskDate[] = []; // La liste des tâches
    date: any = null; // La date qui sera sélectionnée utilisée pour les appels à l'API

    private selDate: IMyDate = {year: 2017, month: 6, day: 6}; // La date sélectionnée dans le date picker
    // Les options du date picker
    private myDatePickerOptions: IMyDpOptions = {
      dateFormat: 'yyyy-mm-dd',
      dayLabels: {su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam'},
      todayBtnTxt: 'Aujourd\'ĥui',
      editableDateField: false,
      showClearDateBtn: false,
      showIncreaseDateBtn: true,
      showDecreaseDateBtn: true,
      openSelectorOnInputClick: true
    }

    constructor(
      private taskService: TaskService,
      public navCtrl: NavController
    ) { }

    ngOnInit() {
        // On va prendre la date d'aujourd'hui et la formatter pour le date picker et l'appel API
        let date = new Date();
        this.selDate = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
        let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
        this.date = dateStr
    }

    // Méthode appelée lorsque la date du date picker change
    onDateChanged(date: IMyDateModel) {
        // On met à jour la date formattée
        this.date = date.formatted
        // On met à jour à la liste des tâches selon la date
        this.updateList(date.formatted)

    }

    // Méthode appelée lorsque l'on clique sur la tâche
    onClickTask(pk: number){
      // On va aller sur la page de la tâche à l'état à la date sélectionnée
      this.navCtrl.push(TaskDetailComponent, {taskDate: pk, date: this.date})
    }

    // Méthode appelée lorsqu'on vient sur la page, important !
    ionViewWillEnter() {
        // On met à jour à la liste des tâches selon la date
        this.updateList(this.date)
    }

    // Méthode appelée permettant de mettre à jour la liste des tâches
    updateList(date: any){
        this.taskService.getTasks(date)
          .subscribe(tasks => {
              this.tasks = tasks
          });
    }

}
