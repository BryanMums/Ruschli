import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';

import { HomeComponent } from '../../_components/home/index';
import { AddTaskComponent } from '../../_components/add_task/index';
import { ResidentsComponent } from '../../_components/residents/index';
import { ProfileComponent } from '../../_components/profile/index'

import { AuthenticationService } from '../../_services/index'

@Component({
  templateUrl: 'tabs.component.html'
})
export class TabsComponent {

  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = ResidentsComponent;
  tab2Root = HomeComponent;
  tab3Root = AddTaskComponent;
  tab4Root = ProfileComponent;

  constructor(private authenticationService: AuthenticationService) {

  }
}
