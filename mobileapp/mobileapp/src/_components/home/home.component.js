"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var index_1 = require("../../_services/index");
var HomeComponent = (function () {
    function HomeComponent(userService, taskService) {
        this.userService = userService;
        this.taskService = taskService;
        this.tasks = [];
        this.task = null;
        this.date = null;
        this.states = {
            LIST: 0,
            DETAIL: 1,
            UPDATE: 2
        };
        this.state = this.states.LIST;
        this.onlyAtDate = true;
        this.selDate = { year: 2017, month: 6, day: 6 };
        this.myDatePickerOptions = {
            dateFormat: 'yyyy-mm-dd',
            dayLabels: { su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam' },
            todayBtnTxt: 'Aujourd\'ĥui',
            editableDateField: false,
            showClearDateBtn: false,
            showIncreaseDateBtn: true,
            showDecreaseDateBtn: true,
            openSelectorOnInputClick: true
        };
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        var date = new Date();
        this.selDate = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        this.date = dateStr;
        // On récupère le résident selon l'id
        this.userService.getTasks(dateStr)
            .subscribe(function (tasks) {
            _this.tasks = tasks;
        });
    };
    HomeComponent.prototype.list = function () {
        var _this = this;
        this.state = this.states.LIST;
        this.task = null;
        this.userService.getTasks(this.date)
            .subscribe(function (tasks) {
            _this.tasks = tasks;
        });
    };
    HomeComponent.prototype.onDateChanged = function (event) {
        var _this = this;
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
        this.task = null;
        var date = event;
        this.date = date.formatted;
        this.userService.getTasks(date.formatted)
            .subscribe(function (tasks) {
            _this.tasks = tasks;
        });
    };
    HomeComponent.prototype.onClickTask = function (pk) {
        var _this = this;
        this.taskService.getTaskDate(pk)
            .subscribe(function (task) {
            _this.task = task;
            _this.state = _this.states.DETAIL;
        });
    };
    HomeComponent.prototype.modify = function (bool) {
        this.onlyAtDate = bool;
        this.state = this.states.UPDATE;
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'home.component.html'
    }),
    __metadata("design:paramtypes", [index_1.UserService,
        index_1.TaskService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map