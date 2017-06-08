import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService, ResidentService } from './_services/index';
import { LoginComponent } from './_components/login/index';
import { HomeComponent } from './_components/home/index';
import { ResidentsComponent } from './_components/residents/index';
import { ResidentComponent } from './_components/resident/index';
import { TaskCardComponent } from './_components/task_card/index';
import { MyDatePickerModule } from 'mydatepicker';

//import { Ng2FlatpickrComponent } from 'flatpickr';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        MyDatePickerModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ResidentsComponent,
        ResidentComponent,
        TaskCardComponent
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
        ResidentService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
