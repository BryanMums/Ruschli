import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from './index';
import { Resident, TaskDate } from '../_models/index';

@Injectable()
export class ResidentService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getResidents(): Observable<Resident[]> {
        // add authorization header with jwt token

        let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get users from api
        return this.http.get('http://localhost:8000/api/resident/', options)
            .map((response: Response) => response.json());
    }

    getResident(resident_id: number): Observable<Resident>{

      let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
      let options = new RequestOptions({ headers: headers });

      // get users from api
      return this.http.get('http://localhost:8000/api/resident/'+resident_id+'/', options)
          .map((response: Response) => response.json());
    }

    getTaskResident(resident_id: number, date:any): Observable<TaskDate[]>{

      let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
      let options = new RequestOptions({ headers: headers });

      // get tasks for the resident at a specified date

      return this.http.get('http://localhost:8000/api/tasks_resident/'+ date +'/'+resident_id+'/', options)
          .map((response: Response) => response.json());

    }
}
