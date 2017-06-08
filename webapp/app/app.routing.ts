import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './_components/login/index';
import { HomeComponent } from './_components/home/index';
import { ResidentsComponent } from './_components/residents/index';
import { ResidentComponent } from './_components/resident/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'residents', component: ResidentsComponent, canActivate: [AuthGuard]},
    { path: 'resident/:id', component: ResidentComponent, canActivate: [AuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
