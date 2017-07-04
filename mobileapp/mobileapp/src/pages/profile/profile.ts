import {Component} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {Headers, Http} from "@angular/http";
import {JwtHelper} from "angular2-jwt";
import {Storage} from "@ionic/storage";
import {AuthService} from "../../_services/auth.service";
import {AuthenticationService} from "../../_services/index";
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  private LOGIN_URL = "http://localhost:8000/api-jwt-auth/";
  private SIGNUP_URL = "http://localhost:3001/users";

  auth: AuthService;

  // When the page loads, we want the Login segment to be selected
  authType: string = "login";

  // We need to set the content type for the server
  contentHeader = new Headers({"Content-Type": "application/json"});
  error: string;
  jwtHelper = new JwtHelper();
  user: string;

  constructor(
    private http: Http,
    private storage: Storage,
    private toastCtrl: ToastController,
    private authenticationService: AuthenticationService) {
    this.auth = AuthService;

    storage.ready().then(() => {
      storage.get('profile').then(profile => {
        this.user = JSON.parse(profile);
      }).catch(console.log);
    });
  }

  authenticate(credentials) {
    this.login(credentials);
  }

  login(credentials) {
    this.authenticationService.login(credentials)

  }

  logout() {
      this.authenticationService.logout()
  }

}
