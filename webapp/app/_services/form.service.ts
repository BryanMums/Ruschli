import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from './index';
import { Resident, TaskDate, Room, User, Sector } from '../_models/index';

@Injectable()
export class FormService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getTaskTypes(): Observable<any[]> {
        let sector = localStorage['sector']
        return this.http.get('http://localhost:8000/api/tasktypes/'+sector+'/', this.authenticationService.options)
            .map((response: Response) => response.json());
    }

    getResidents(): Observable<Resident[]> {
        // get users from api
        return this.http.get('http://localhost:8000/api/resident/', this.authenticationService.options)
            .map((response: Response) => response.json());
    }

    getRooms(): Observable<Room[]> {
        // get users from api
        return this.http.get('http://localhost:8000/api/room/', this.authenticationService.options)
            .map((response: Response) => response.json());
    }

    getUsers(): Observable<User[]> {
      return this.http.get('http://localhost:8000/api/user/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    getGroups(): Observable<Sector[]> {
        return this.http.get('http://localhost:8000/api/group/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    addTask(data:any): Observable<Response>{
        let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token , 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8000/api/createtask/', data, options)
          .map((response: Response) => response.json());
    }

    updateTask(data:any): Observable<Response>{
        let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token, 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8000/api/updatetask/', data, options)
          .map((response: Response) => response.json());
    }
}
