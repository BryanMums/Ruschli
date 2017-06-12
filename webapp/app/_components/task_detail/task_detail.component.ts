import { Component, OnInit, Input } from '@angular/core';
import { User, TaskDate } from '../../_models/index';
import { UserService, TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    moduleId: module.id,
    templateUrl: 'task_detail.component.html'
})

export class TaskDetailComponent implements OnInit {
    private today: IMyDate = {year: 2017, month: 6, day: 6}
    @Input() taskDate: TaskDate;
    canTakeInCharge = true;

    constructor(
      private userService: UserService,
      private taskService: TaskService,
      private route: ActivatedRoute,
      private router: Router
    ) { }

    ngOnInit() {
      let date = new Date();
      this.today = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
      let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
      // On récupère le résident selon l'id
      this.route.params
      .switchMap((params: Params) => this.taskService.getTaskDate(+params['id']))
      .subscribe((taskDate: TaskDate) => {
        this.taskDate = taskDate
      })
    }

}
