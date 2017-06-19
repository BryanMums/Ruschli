"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./_components/login/index");
var index_2 = require("./_components/home/index");
var index_3 = require("./_components/residents/index");
var index_4 = require("./_components/resident/index");
var index_5 = require("./_components/task_detail/index");
var index_6 = require("./_components/choose_sector/index");
var index_7 = require("./_components/add_task/index");
var index_8 = require("./_guards/index");
var appRoutes = [
    { path: 'login', component: index_1.LoginComponent },
    { path: '', component: index_2.HomeComponent, canActivate: [index_8.AuthGuard] },
    { path: 'residents', component: index_3.ResidentsComponent, canActivate: [index_8.AuthGuard] },
    { path: 'resident/:id', component: index_4.ResidentComponent, canActivate: [index_8.AuthGuard] },
    { path: 'task/:id', component: index_5.TaskDetailComponent, canActivate: [index_8.AuthGuard] },
    { path: 'choose-sector', component: index_6.ChooseSectorComponent, canActivate: [index_8.AuthGuard] },
    { path: 'task-add', component: index_7.AddTaskComponent, canActivate: [index_8.AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map