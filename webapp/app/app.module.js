"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var index_1 = require("./_guards/index");
var index_2 = require("./_services/index");
var index_3 = require("./_components/login/index");
var index_4 = require("./_components/profile/index");
var index_5 = require("./_components/home/index");
var index_6 = require("./_components/residents/index");
var index_7 = require("./_components/resident/index");
var index_8 = require("./_components/task_card/index");
var index_9 = require("./_components/task_detail/index");
var index_10 = require("./_components/choose_sector/index");
var index_11 = require("./_components/add_task/index");
var index_12 = require("./_components/update_task/index");
var index_13 = require("./_components/stop_task/index");
var index_14 = require("./_components/form_task/index");
var mydatepicker_1 = require("mydatepicker");
var angular_2_dropdown_multiselect_1 = require("angular-2-dropdown-multiselect");
var angular2_toaster_1 = require("angular2-toaster");
var index_15 = require("./_utils/index");
var angular2_moment_1 = require("angular2-moment");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                http_1.HttpModule,
                app_routing_1.routing,
                mydatepicker_1.MyDatePickerModule,
                angular_2_dropdown_multiselect_1.MultiselectDropdownModule,
                angular2_moment_1.MomentModule,
                angular2_toaster_1.ToasterModule
            ],
            declarations: [
                app_component_1.AppComponent,
                index_3.LoginComponent,
                index_4.ProfileComponent,
                index_5.HomeComponent,
                index_6.ResidentsComponent,
                index_7.ResidentComponent,
                index_8.TaskCardComponent,
                index_9.TaskDetailComponent,
                index_10.ChooseSectorComponent,
                index_11.AddTaskComponent,
                index_12.UpdateTaskComponent,
                index_13.StopTaskComponent,
                index_14.FormTaskComponent,
                index_15.KeysPipe,
                index_15.ValuesPipe
            ],
            providers: [
                index_1.AuthGuard,
                index_2.AuthenticationService,
                index_2.UserService,
                index_2.ResidentService,
                index_2.TaskService,
                index_2.FormService,
                index_2.RoomService,
                index_2.SectorService,
                angular2_toaster_1.ToasterService,
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map