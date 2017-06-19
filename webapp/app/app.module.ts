import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService, ResidentService, TaskService, FormService } from './_services/index';
import { LoginComponent } from './_components/login/index';
import { HomeComponent } from './_components/home/index';
import { ResidentsComponent } from './_components/residents/index';
import { ResidentComponent } from './_components/resident/index';
import { TaskCardComponent } from './_components/task_card/index';
import { TaskDetailComponent } from './_components/task_detail/index';
import { ChooseSectorComponent } from './_components/choose_sector/index';
import { AddTaskComponent } from './_components/add_task/index';
import { MyDatePickerModule } from 'mydatepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { KeysPipe, ValuesPipe } from './_utils/index'

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        MyDatePickerModule,
        MultiselectDropdownModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ResidentsComponent,
        ResidentComponent,
        TaskCardComponent,
        TaskDetailComponent,
        ChooseSectorComponent,
        AddTaskComponent,
        KeysPipe,
        ValuesPipe
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
        ResidentService,
        TaskService,
        FormService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
