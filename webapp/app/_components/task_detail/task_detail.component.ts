import { Component, OnInit, Input } from '@angular/core';
import { User, TaskDate } from '../../_models/index';
import { UserService, TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'task-detail',
    moduleId: module.id,
    templateUrl: 'task_detail.component.html'
})

export class TaskDetailComponent implements OnInit {
    private today: IMyDate = {year: 2017, month: 6, day: 6}
    @Input() date: any;
    @Input() taskDate: TaskDate;
    canTakeInCharge = true;
    public myForm: FormGroup;

    constructor(
      private userService: UserService,
      private taskService: TaskService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb: FormBuilder,
    ) { }

    ngOnInit() {
      let date = new Date();
      this.today = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
      let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
      // On récupère le résident selon l'id
      this.myForm = this._fb.group({
          text: ['', Validators.required]
        })
    }

    addComment(model: any, isValid: Boolean){
        console.log(model.text, this.date, this.taskDate.pk)
        let data = {}
        data["text"] = model.text
        data["date"] = this.date
        data["taskdate"] = this.taskDate.pk
        this.taskService.addComment(data)
          .subscribe(taskDate => {
            if(taskDate.pk != null){
              this.taskDate = taskDate
            }else{
              console.log("Erreur")
            }
          })
        this.myForm = this._fb.group({
            text: ['', Validators.required]
          })

    }

}
