import { Component, OnInit } from '@angular/core';

import { User, TaskDate } from '../../_models/index';
import { TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';

@Component({
    moduleId: module.id,
    templateUrl: 'add_task.component.html'
})

export class AddTaskComponent implements OnInit {
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
      private taskService: TaskService

    ) { }

    ngOnInit() {
        let date = new Date();
        this.selDate = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
        let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
        // On récupère le résident selon l'id


    }
}
