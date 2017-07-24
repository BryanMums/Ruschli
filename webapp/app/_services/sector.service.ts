import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs'
import { AuthenticationService } from './index'
import { Sector } from '../_models/index'

@Injectable()
export class SectorService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    // Retourne la liste de tous les secteurs
    getSectors(): Observable<Sector[]> {
        return this.http.get(this.authenticationService.URL + 'api/group/', this.authenticationService.options)
          .map((response: Response) => response.json())
    }
}
