import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Headers, RequestOptions } from '@angular/http';
import { Group, User } from '../_models/index';
import { UserService } from './index';
//import { JwtHelper} from 'angular2-jwt';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public user: User;
    public token: string;
    public selectedGroup: Group;
    public headers: Headers;
    public options: RequestOptions;

    constructor(private http: Http) {
        // set token if saved in local storage
        if(localStorage['currentUser']){
            var currentUser = JSON.parse(localStorage['currentUser']);
        }else{
            var currentUser = null;
        }
        this.token = currentUser && currentUser.token;
        this.headers = new Headers({ 'Authorization': 'JWT ' + this.token });
        this.options = new RequestOptions({ headers: this.headers });
    }

    login(username: string, password: string): Observable<boolean> {
        let body = JSON.stringify({ username: username, password: password });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers});
        return this.http.post('http://localhost:8000/api-jwt-auth/', body, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage['currentUser'] = JSON.stringify({ username: username, token: token });
                    //let jwtHelper = new JwtHelper();

                    // On va récupérer les groupes

                    //console.log(this.user);
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    getUser(): Observable<User>{
      let headers = new Headers({ 'Authorization': 'JWT ' + this.token });
      let options = new RequestOptions({ headers: headers });
      return this.http.get('http://localhost:8000/api/get_connected_user/', options)
      .map((response: Response) => response.json());
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        delete localStorage['currentUser'];
        //localStorage.clear();
    }
}
