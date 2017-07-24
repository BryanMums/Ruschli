import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs'
import { Headers, RequestOptions } from '@angular/http'
import { User, Sector } from '../_models/index'
import { tokenNotExpired } from 'angular2-jwt'
import { ToasterService } from 'angular2-toaster'
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public user: User
    public token: string
    public selectedSector: Sector
    public headers: Headers
    public options: RequestOptions
    public URL: string = "http://localhost:8000/"


    constructor(private http: Http, private toasterService: ToasterService) {
      // S'il existe un token en storage local
      if(localStorage['token']){
          this.token = localStorage['token']
      }else{
          this.token = null
      }
      // On configure les en-têtes pour les appels à l'API
      this.headers = new Headers({ 'Authorization': 'JWT ' + this.token ,"Content-Type": "application/json"})
      this.options = new RequestOptions({ headers: this.headers })
    }

    // Méthode permettant de s'authentifier à l'API
    login(credentials:any): any {
        let body = JSON.stringify(credentials)
        return this.http.post(this.URL +'api-jwt-auth/', body, this.options)
            .map(res => res.json())
            .subscribe(
              data => {
                // On va enregistrer le token et les différentes entités permettant de faire des appels à l'API
                this.token = data.token
                localStorage.setItem('token', data.token)
                localStorage.setItem('sector', '0')
                this.headers = new Headers({ 'Authorization': 'JWT ' + this.token ,"Content-Type": "application/json"})
                this.options = new RequestOptions({ headers: this.headers })
                this.toasterService.pop('success', 'Connexion réussie', 'La connexion a réussi ! Bienvenue !')
              },
              err => {
                this.toasterService.pop('error', 'Connexion échouée', 'Vos informations de connexion sont faux !')
              }
            )
    }

    // Méthode permettant de récupérer les informations de l'utilisateur connecté
    getUser(): Observable<User>{
      return this.http.get(this.URL + 'api/get_connected_user/', this.options)
      .map((response: Response) => response.json())
    }

    // Méthode permettant de se déconnecter
    logout(): void {
        // On enlève les différentes valeurs en localStorage
        this.token = null
        delete localStorage['token']
        delete localStorage['sector']
        this.user = null
    }

    // Méthode appelée pour savoir si l'utilisateur est connectée.
    authenticated(){
      // tokenNotExpired permet de savoir si le token est valide
      return tokenNotExpired()
    }

    // Méthode permettant de savoir si l'utilisateur a un secteur en cours
    has_a_sector(){
      return localStorage["sector"] != '0'
    }
}
