import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, Events } from 'ionic-angular';

import { ProfileComponent } from '../_components/profile/index';
import { ResidentsComponent } from '../_components/residents/index';
import { HomeComponent } from '../_components/home/index';
import { AddTaskComponent } from '../_components/add_task/index';

import { TabsComponent } from '../_components/tabs/index';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AuthenticationService} from '../_services/index';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = ProfileComponent;
  pages: Array<{title: string, component: any}>;
  securePages: Array<{title: string, component:any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public authenticationService: AuthenticationService
  ){
    this.initializeApp();
    this.rootPage = TabsComponent
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
    });
  }
}
