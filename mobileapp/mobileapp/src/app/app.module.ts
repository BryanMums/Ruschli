import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { AuthenticationService, UserService, ResidentService, TaskService, RoomService, SectorService } from '../_services/index';

import { TabsComponent } from '../_components/tabs/index';
import { ProfileComponent } from '../_components/profile/index';
import { ChooseSectorComponent } from '../_components/choose_sector/index';
import { HomeComponent } from '../_components/home/index';
import { AddTaskComponent } from '../_components/add_task/index';
import { ResidentsComponent } from '../_components/residents/index';
import { ResidentComponent } from '../_components/resident/index';
import { TaskCardComponent } from '../_components/task_card/index';
import { TaskDetailComponent } from '../_components/task_detail/index';
import { UpdateTaskComponent } from '../_components/update_task/index';
import { FormTaskComponent } from '../_components/form_task/index';
import { StopTaskComponent } from '../_components/stop_task/index';

import { MyDatePickerModule } from 'mydatepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { KeysPipe, ValuesPipe, ReplaceLineBreaks } from '../_utils/index';
import { MomentModule } from 'angular2-moment';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    ProfileComponent,
    TabsComponent,
    ChooseSectorComponent,
    HomeComponent,
    AddTaskComponent,
    ResidentsComponent,
    ResidentComponent,
    TaskCardComponent,
    TaskDetailComponent,
    UpdateTaskComponent,
    FormTaskComponent,
    StopTaskComponent,
    KeysPipe,
    ValuesPipe,
    ReplaceLineBreaks
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MyDatePickerModule,
    ReactiveFormsModule,
    HttpModule,
    MultiselectDropdownModule,
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsComponent,
    ProfileComponent,
    ResidentsComponent,
    ResidentComponent,
    HomeComponent,
    TaskDetailComponent,
    AddTaskComponent,
    UpdateTaskComponent,
    FormTaskComponent,
    StopTaskComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    UserService,
    ResidentService,
    TaskService,
    RoomService,
    SectorService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage
  ]
})
export class AppModule {}
