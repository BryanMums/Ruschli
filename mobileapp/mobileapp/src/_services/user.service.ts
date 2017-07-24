import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import { AuthenticationService } from './index'
import { User, TaskDate } from '../_models/index'
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    // Méthode permettant de récupérer la liste des utilisateurs (employés)
    getUsers(): Observable<User[]> {
        return this.http.get(this.authenticationService.URL + 'api/user/', this.authenticationService.options)
            .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer les informations de l'utilisateur connecté
    getConnectedUser(): Observable<User> {
      return this.http.get(this.authenticationService.URL + 'api/get_connected_user/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer les tâches destinées à l'utilisateur et son secteur sélectionné
    getTasks(date:any): Observable<TaskDate[]>{
      let sector = localStorage["sector"];
      return this.http.get(this.authenticationService.URL + 'api/tasks/'+ date +'/'+sector+'/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }
}
