import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import { AuthenticationService } from './index'
import { TaskDate } from '../_models/index'
import 'rxjs/add/operator/map'

@Injectable()
export class TaskService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    // Méthode permettant de récupérer les tâches d'un utilisateur selon une date et un secteur
    getTasks(date:any): Observable<TaskDate[]>{
      let sector = localStorage["sector"];
      return this.http.get(this.authenticationService.URL + 'api/tasks/'+ date +'/'+sector+'/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer une TaskDate/Apparition selon son ID
    getTaskDate(taskDate_id: number): Observable<TaskDate>{
      return this.http.get(this.authenticationService.URL + 'api/taskdate/'+taskDate_id+'/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer la bonne TaskDate/apparition selon son ID et une date
    getTaskDate_date(taskDate_id:number, date:any): Observable<TaskDate>{
      return this.http.get(this.authenticationService.URL + 'api/get_taskdate/' + taskDate_id + '/' + date + '/', this.authenticationService.options)
        .map((response: Response) => response.json())
    }

    // Méthode permettant de récupérer les permissions concernant une apparition et le secteur
    getPermissions(taskDate_id:number): Observable<any>{
      let sector = localStorage['sector']
      return this.http.get(this.authenticationService.URL + 'api/get_permissions/' + taskDate_id + '/' + sector + '/', this.authenticationService.options)
        .map((response: Response) => response.json())
    }

    // Méthode permettant de récupérer les types de tâches selon son secteur de travail
    getTaskTypes(): Observable<any[]> {
      let sector = localStorage['sector']
      return this.http.get(this.authenticationService.URL + 'api/tasktypes/'+sector+'/', this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    // Méthode permettant de récupérer les informations d'un type de tâche selon son ID
    getTaskType(pk: number): Observable<any>{
      return this.http.get(this.authenticationService.URL + 'api/tasktype/'+pk+'/', this.authenticationService.options)
        .map((response: Response) => response.json());
    }

    // Méthode permettant d'ajouter un commentaire à une TaskDate/Apparition
    addComment(data:any): Observable<TaskDate>{
        return this.http.post(this.authenticationService.URL + 'api/addcomment/', data, this.authenticationService.options)
          .map((response: Response) => response.json());
    }

    // Méthode permettant d'ajouter l'utilisateur comme "preneur" d'une TaskDate
    addTaker(data:any): Observable<TaskDate>{
      return this.http.post(this.authenticationService.URL + 'api/addtaker/', data, this.authenticationService.options)
        .map((response: Response) => response.json());
    }

    // Méthode permettant d'arrêter une tâche
    stopTaskDate(data:any): Observable<any>{
      return this.http.post(this.authenticationService.URL + 'api/stoptask/', data, this.authenticationService.options)
        .map((response: Response) => response.json());
    }

    // Méthode permettant de réactiver une apparition (Une tâche à une date précise dans une apparition périodique)
    activateTaskDate(pk: number, date:any): Observable<Boolean>{
      return this.http.get(this.authenticationService.URL + 'api/activate_taskdate/' + pk + '/' + date + '/',this.authenticationService.options)
        .map((response: Response) => response.json())
    }

    // Méthode permettant d'ajouter une tâche
    addTask(data:any): Observable<Response>{
      return this.http.post(this.authenticationService.URL + 'api/createtask/', data, this.authenticationService.options)
        .map((response: Response) => response.json());
    }

    // Méthode permettant de mettre à jour une tâche
    updateTask(data:any): Observable<Response>{
      return this.http.post(this.authenticationService.URL + 'api/updatetask/', data, this.authenticationService.options)
        .map((response: Response) => response.json());
    }
}
