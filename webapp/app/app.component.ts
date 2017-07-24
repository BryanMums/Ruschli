import { Component } from '@angular/core';
import { AuthenticationService } from './_services/index';
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent {

  constructor( private authenticationService: AuthenticationService){}
}
