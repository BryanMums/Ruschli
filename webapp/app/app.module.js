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
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var index_1 = require("./_guards/index");
var index_2 = require("./_services/index");
var index_3 = require("./_components/login/index");
var index_4 = require("./_components/home/index");
var index_5 = require("./_components/residents/index");
var index_6 = require("./_components/resident/index");
var index_7 = require("./_components/task_card/index");
var index_8 = require("./_components/task_detail/index");
var index_9 = require("./_components/choose_sector/index");
var index_10 = require("./_components/add_task/index");
var mydatepicker_1 = require("mydatepicker");
var angular_2_dropdown_multiselect_1 = require("angular-2-dropdown-multiselect");
var index_11 = require("./_utils/index");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            app_routing_1.routing,
            mydatepicker_1.MyDatePickerModule,
            angular_2_dropdown_multiselect_1.MultiselectDropdownModule
        ],
        declarations: [
            app_component_1.AppComponent,
            index_3.LoginComponent,
            index_4.HomeComponent,
            index_5.ResidentsComponent,
            index_6.ResidentComponent,
            index_7.TaskCardComponent,
            index_8.TaskDetailComponent,
            index_9.ChooseSectorComponent,
            index_10.AddTaskComponent,
            index_11.KeysPipe,
            index_11.ValuesPipe
        ],
        providers: [
            index_1.AuthGuard,
            index_2.AuthenticationService,
            index_2.UserService,
            index_2.ResidentService,
            index_2.TaskService,
            index_2.FormService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map