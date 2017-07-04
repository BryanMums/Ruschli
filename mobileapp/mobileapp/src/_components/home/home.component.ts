import { Component, OnInit } from '@angular/core';

import { User, TaskDate } from '../../_models/index';
import { UserService, TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';

@Component({
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    tasks: TaskDate[] = [];
    task: TaskDate = null;
    date: any = null;
    states = {
      LIST: 0,
      DETAIL: 1,
      UPDATE: 2
    }
    state :any = this.states.LIST
    onlyAtDate = true

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
      private userService: UserService,
      private taskService: TaskService

    ) { }

    ngOnInit() {
        let date = new Date();
        this.selDate = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
        let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
        this.date = dateStr
        // On récupère le résident selon l'id
        this.userService.getTasks(dateStr)
          .subscribe(tasks => {
              this.tasks = tasks;
          });

    }

    list(){
        this.state = this.states.LIST
        this.task = null;
        this.userService.getTasks(this.date)
          .subscribe(tasks => {
            this.tasks = tasks;
          })
    }

    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
        this.task = null;
        let date = event
        this.date = date.formatted
        this.userService.getTasks(date.formatted)
          .subscribe(tasks => {
            this.tasks = tasks;
          })
    }

    onClickTask(pk: number){
      this.taskService.getTaskDate(pk)
        .subscribe(task => {
            this.task = task;
            this.state = this.states.DETAIL
        })
    }

    modify(bool: boolean){
        this.onlyAtDate = bool
        this.state = this.states.UPDATE
    }

}
