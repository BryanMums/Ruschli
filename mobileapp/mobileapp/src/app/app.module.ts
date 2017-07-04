import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { AuthGuard } from '../_guards/index';
import { AuthenticationService, UserService, ResidentService, TaskService, FormService } from '../_services/index';

import { LoginComponent } from '../_components/login/index';
import { ChooseSectorComponent } from '../_components/choose_sector/index';
import { HomeComponent } from '../_components/home/index';
import { AddTaskComponent } from '../_components/add_task/index';
import { ResidentsComponent } from '../_components/residents/index';
import { ResidentComponent } from '../_components/resident/index';
import { TaskCardComponent } from '../_components/task_card/index';
import { TaskDetailComponent } from '../_components/task_detail/index';

import { MyDatePickerModule } from 'mydatepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { KeysPipe, ValuesPipe } from '../_utils/index';
import { MomentModule } from 'angular2-moment';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { Profile } from '../pages/profile/profile';
import { QuotesPage } from '../pages/quotes/quotes';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    Profile,
    QuotesPage,
    LoginComponent,
    ChooseSectorComponent,
    HomeComponent,
    AddTaskComponent,
    ResidentsComponent,
    ResidentComponent,
    TaskCardComponent,
    TaskDetailComponent,
    KeysPipe,
    ValuesPipe
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
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    Profile,
    QuotesPage,
    ResidentsComponent,
    ResidentComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuard,
    AuthenticationService,
    UserService,
    ResidentService,
    TaskService,
    FormService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage
  ]
})
export class AppModule {}
