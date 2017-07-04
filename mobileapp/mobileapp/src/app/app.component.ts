import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { Profile } from '../pages/profile/profile';
import { QuotesPage } from '../pages/quotes/quotes';
import { ResidentsComponent } from '../_components/residents/index';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AuthService} from "../_services/auth.service";
import {AuthenticationService} from '../_services/index';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = Profile;
  pages: Array<{title: string, component: any}>;
  securePages: Array<{title: string, component:any}>;
  auth: AuthService

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authenticationService: AuthenticationService
  ) {
    this.initializeApp();

    if(authenticationService.authenticated()){
      this.rootPage = ResidentsComponent
    }
    // set our app's pages
    this.pages = [
        { title: 'Profile', component: Profile }
    ];
    this.securePages = [
        { title: 'Résidents', component: ResidentsComponent},
        { title: 'Tâches', component: HelloIonicPage },
        { title: 'Nouvelle tâche', component: ListPage },
    ]
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
