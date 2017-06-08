﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, UserService } from '../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                  this.authenticationService.getUser()
                    .subscribe(result => {
                        if(result.sectors.length == 0){
                            console.log("Pas de secteur");
                            localStorage['sector'] = null;
                            this.router.navigate(['/']);
                        }else if(result.sectors.length == 1){
                            console.log("Un secteur");
                            localStorage['sector'] = result.sectors[0];
                            this.router.navigate(['/']);
                        }else{
                          console.log("Plusieurs secteurs");
                          this.router.navigate(['/residents'])
                        }
                    });

                } else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}