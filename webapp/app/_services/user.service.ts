import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from './index';
import { User, Group, TaskDate } from '../_models/index';

@Injectable()
export class UserService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getUsers(): Observable<User[]> {
        // add authorization header with jwt token

        let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get users from api
        return this.http.get('http://localhost:8000/api/user/', options)
            .map((response: Response) => response.json());
    }

    getConnectedUser(): Observable<User> {
      let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
      let options = new RequestOptions({ headers: headers });

      // get users from api
      return this.http.get('http://localhost:8000/api/get_connected_user/', options)
          .map((response: Response) => response.json());
    }

    getTasks(date:any): Observable<TaskDate[]>{

      let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
      let options = new RequestOptions({ headers: headers });

      // get tasks for the resident at a specified date

      return this.http.get('http://localhost:8000/api/tasks/'+ date +'/1/', options)
          .map((response: Response) => response.json());

    }
}
