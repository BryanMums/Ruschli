import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs'
import { AuthenticationService } from './index'
import { Room } from '../_models/index'

@Injectable()
export class RoomService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    // Retourne la liste de toutes les salles
    getRooms(): Observable<Room[]> {
        return this.http.get(this.authenticationService.URL + 'api/room/', this.authenticationService.options)
            .map((response: Response) => response.json());
    }
}
