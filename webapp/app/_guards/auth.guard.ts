import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {tokenNotExpired} from 'angular2-jwt'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        /*if (localStorage['currentUser']) {
            // logged in so return true
            return true;
        }
        console.log(localStorage['currentUser'])
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;*/
        if(tokenNotExpired()){
          return true
        }
        this.router.navigate(['/profile']);
        return tokenNotExpired()
    }
}
