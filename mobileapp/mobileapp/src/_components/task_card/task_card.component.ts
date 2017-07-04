import { Component, OnInit, Input } from '@angular/core';
//import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Resident, TaskDate } from '../../_models/index';
import { ResidentService } from '../../_services/index';
import {IMyDpOptions, IMyDateModel, IMyDate} from 'mydatepicker';

@Component({
    selector: 'task-card',
    templateUrl: 'task_card.component.html'
})

export class TaskCardComponent {
    @Input() taskDate: TaskDate

    constructor(
      //private router: Router
    ){}

    detail(){
      console.log("lol")
      //this.router.navigate(['./task',this.taskDate.pk])
    }

}