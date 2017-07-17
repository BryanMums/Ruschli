import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import { AuthenticationService } from './index'
import { Resident, TaskDate } from '../_models/index'

@Injectable()
export class ResidentService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    // Méthode permettant de récupérer la liste des résidents
    getResidents(): Observable<Resident[]> {
        return this.http.get(this.authenticationService.URL + 'api/resident/',this.authenticationService.options)
            .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer les informations d'un résident selon son ID
    getResident(resident_id: number): Observable<Resident>{
      return this.http.get(this.authenticationService.URL + 'api/resident/'+resident_id+'/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer les tâches concernant le résident à une date
    getTaskResident(resident_id: number, date:any): Observable<TaskDate[]>{
      return this.http.get(this.authenticationService.URL + 'api/tasks_resident/'+ date +'/'+resident_id+'/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }
}
