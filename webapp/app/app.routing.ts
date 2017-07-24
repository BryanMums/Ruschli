import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './_components/login/index';
import { ProfileComponent } from './_components/profile/index';
import { HomeComponent } from './_components/home/index';
import { ResidentsComponent } from './_components/residents/index';
import { ResidentComponent } from './_components/resident/index';
import { TaskDetailComponent } from './_components/task_detail/index';
import { ChooseSectorComponent } from './_components/choose_sector/index';
import { AddTaskComponent } from './_components/add_task/index';
import { UpdateTaskComponent } from './_components/update_task/index';
import { StopTaskComponent } from './_components/stop_task/index';

import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'residents', component: ResidentsComponent, canActivate: [AuthGuard]},
    { path: 'resident/:id', component: ResidentComponent, canActivate: [AuthGuard]},
    { path: 'task/:id/:date', component: TaskDetailComponent, canActivate: [AuthGuard]},
    { path: 'choose-sector', component: ChooseSectorComponent, canActivate: [AuthGuard]},
    { path: 'task-add', component: AddTaskComponent, canActivate: [AuthGuard]},
    { path: 'update-task/:id/:date', component: UpdateTaskComponent, canActivate: [AuthGuard]},
    { path: 'stop-task/:id/:date', component: StopTaskComponent, canActivate: [AuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
