import {Component} from "@angular/core";
import {AuthenticationService} from "../../_services/index";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html',
})
export class ProfileComponent {

  constructor(
    private authenticationService: AuthenticationService) {}

  // Méthode appelée lors de l'envoi du formulaire de connexion
  login(credentials) {
    this.authenticationService.login(credentials)

  }

  // Méthode appelée lorsque l'utilisateur veut se déconnecter
  logout() {
      this.authenticationService.logout()
  }
}
