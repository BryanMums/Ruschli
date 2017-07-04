import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import { Headers, RequestOptions } from '@angular/http';
import { Group, User } from '../_models/index';
import { UserService } from './index';
//import { JwtHelper} from 'angular2-jwt';
import {tokenNotExpired} from 'angular2-jwt';
import 'rxjs/add/operator/map'
import { ToastController } from 'ionic-angular';

@Injectable()
export class AuthenticationService {
    public user: User;
    public token: string;
    public selectedGroup: Group;
    public headers: Headers;
    public options: RequestOptions;

    constructor(private http: Http,private toastCtrl: ToastController,) {
        // set token if saved in local storage
        if(localStorage['token']){
            var currentUser = localStorage['token'];
        }else{
            var currentUser = null;
        }
        this.token = currentUser;
        this.headers = new Headers({ 'Authorization': 'JWT ' + this.token ,"Content-Type": "application/json"});
        this.options = new RequestOptions({ headers: this.headers });
    }

    login(credentials:any): any {
        let body = JSON.stringify(credentials);
        return this.http.post('http://localhost:8000/api-jwt-auth/', body, this.options)
            .map(res => res.json())
            .subscribe(
              data => {
                this.token = data.token
                localStorage.setItem('token', data.token)
                let toast = this.toastCtrl.create({
                  message: 'L\'authentification a réussi ! Bienvenue !',
                  duration: 3000,
                  position: 'bottom',
                  cssClass: 'success'
                });

                toast.present();
              },
              err => {
                let toast = this.toastCtrl.create({
                  message: 'L\'authentification a échouée ! Veuillez réessayer !',
                  duration: 3000,
                  position: 'bottom',
                  cssClass: 'error'
                });

                toast.present();
              }
            )
    }

    getUser(): Observable<User>{
      return this.http.get('http://localhost:8000/api/get_connected_user/', this.options)
      .map((response: Response) => response.json());
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        delete localStorage['currentUser'];
        //localStorage.clear();

        delete localStorage['token']
        delete localStorage['user']
        this.user = null;
        let toast = this.toastCtrl.create({
          message: 'Déconnexion avec succès !',
          duration: 3000,
          position: 'bottom',
          cssClass: 'success'
        });

        toast.present();
    }


    authenticated(){
      return tokenNotExpired();
    }

    has_a_sector(){
      return localStorage["sector"] != null
    }
}
