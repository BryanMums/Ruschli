import {Component} from "@angular/core";
import {AuthenticationService} from "../../_services/index";
import {ToasterContainerComponent, ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
  moduleId: module.id,
  selector: 'page-profile',
  templateUrl: 'profile.component.html',
})
export class ProfileComponent {

  constructor(
    private authenticationService: AuthenticationService, private toasterService: ToasterService) {}

  // Méthode appelée lors de l'envoi du formulaire de connexion
  login(credentials:any) {
    this.authenticationService.login(credentials)
  }

  // Méthode appelée lorsque l'utilisateur veut se déconnecter
  logout() {
      this.authenticationService.logout()
  }
}
