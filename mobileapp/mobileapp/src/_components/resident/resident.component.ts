import { Component, OnInit, Input } from '@angular/core'
import { Resident, TaskDate } from '../../_models/index'
import { ResidentService } from '../../_services/index'
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker'
import { NavController, NavParams } from 'ionic-angular'
import { TaskDetailComponent } from '../../_components/task_detail/index'

@Component({
    selector: 'resident',
    templateUrl: 'resident.component.html'
})

export class ResidentComponent implements OnInit {
    @Input() resident: Resident;
    tasks: TaskDate[] = [];
    public date:any = null
    private selDate: IMyDate = {year: 2017, month: 6, day: 6};
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
      private residentService: ResidentService,
      private navParams: NavParams,
      public navCtrl: NavController
    ) { }

    ngOnInit() {
        let date = new Date();
        this.selDate = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
        let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
        this.date = dateStr

        // Récupération du résident
        let pk = this.navParams.get("id")
        this.residentService.getResident(pk)
        .subscribe((resident: Resident) => {
          this.resident = resident
          // On récupère les tâches le concernant selon la date.
          this.updateList()
            })
    }

    // Méthode appelée quand on clique sur une tâche
    onClickTask(pk: number){
      this.navCtrl.push(TaskDetailComponent, {taskDate: pk, date: this.date})
    }

    // Méthode appelée lorsqu'on change de date dans le date picker
    onDateChanged(date: IMyDateModel) {
        this.date = date.formatted
        this.updateList()
    }

    // Méthode appelée lorsqu'on vient sur la page, important !
    ionViewWillEnter() {
        // On met à jour à la liste des tâches selon la date
        if(this.resident != null){
          this.updateList()
        }
    }

    // Permet de mettre à jour la liste des tâches concernant le résident
    updateList(){
      this.residentService.getTaskResident(this.resident.pk, this.date)
        .subscribe(tasks => {
          this.tasks = tasks
        })
    }


}
