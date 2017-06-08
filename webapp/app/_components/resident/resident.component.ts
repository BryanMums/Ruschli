import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Resident, TaskDate } from '../../_models/index';
import { ResidentService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';

@Component({
    selector: 'resident',
    moduleId: module.id,
    templateUrl: 'resident.component.html'
})

export class ResidentComponent implements OnInit {
    @Input() resident: Resident;
    tasks: TaskDate[] = [];
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
      private route: ActivatedRoute,
      private router: Router
    ) { }

    ngOnInit() {
        let date = new Date();
        this.selDate = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
        let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
        // On récupère le résident selon l'id
        this.route.params
        .switchMap((params: Params) => this.residentService.getResident(+params['id']))
        .subscribe((resident: Resident) => {
          this.resident = resident
          // On récupère les tâches le concernant selon la date.
          this.residentService.getTaskResident(this.resident.pk, dateStr)
              .subscribe(tasks => {
                  this.tasks = tasks;
              });
        })
    }

    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
        let date = event
        console.log(date.formatted)
        this.residentService.getTaskResident(this.resident.pk, date.formatted)
          .subscribe(tasks => {
            this.tasks = tasks;
          })
    }
}
