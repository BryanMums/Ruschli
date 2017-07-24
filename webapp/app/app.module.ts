import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService, ResidentService, TaskService, FormService, RoomService, SectorService } from './_services/index';

import { LoginComponent } from './_components/login/index';
import { ProfileComponent } from './_components/profile/index';
import { HomeComponent } from './_components/home/index';
import { ResidentsComponent } from './_components/residents/index';
import { ResidentComponent } from './_components/resident/index';
import { TaskCardComponent } from './_components/task_card/index';
import { TaskDetailComponent } from './_components/task_detail/index';
import { ChooseSectorComponent } from './_components/choose_sector/index';
import { AddTaskComponent } from './_components/add_task/index';
import { UpdateTaskComponent } from './_components/update_task/index';
import { StopTaskComponent } from './_components/stop_task/index';
import { FormTaskComponent } from './_components/form_task/index';

import { MyDatePickerModule } from 'mydatepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { KeysPipe, ValuesPipe } from './_utils/index'
import { MomentModule } from 'angular2-moment';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        MyDatePickerModule,
        MultiselectDropdownModule,
        MomentModule,
        ToasterModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        ProfileComponent,
        HomeComponent,
        ResidentsComponent,
        ResidentComponent,
        TaskCardComponent,
        TaskDetailComponent,
        ChooseSectorComponent,
        AddTaskComponent,
        UpdateTaskComponent,
        StopTaskComponent,
        FormTaskComponent,
        KeysPipe,
        ValuesPipe
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
        ResidentService,
        TaskService,
        FormService,
        RoomService,
        SectorService,
        ToasterService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
