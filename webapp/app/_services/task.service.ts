import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from './index';
import { Resident, TaskDate } from '../_models/index';

@Injectable()
export class TaskService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getTaskDate(taskDate_id: number): Observable<TaskDate>{

      let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
      let options = new RequestOptions({ headers: headers });

      // get users from api
      return this.http.get('http://localhost:8000/api/taskdate/'+taskDate_id+'/', options)
          .map((response: Response) => response.json());
    }
}
