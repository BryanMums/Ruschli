import { Component, OnInit, Input } from '@angular/core';
import { User, TaskDate } from '../../_models/index';
import { UserService, TaskService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
//import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'update-task',
    //moduleId: module.id,
    templateUrl: 'update_task.component.html'
})

export class UpdateTaskComponent{}
