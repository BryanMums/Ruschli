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
var index_1 = require("../../_models/index");
var index_2 = require("../../_services/index");
var router_1 = require("@angular/router");
require("rxjs/add/operator/switchMap");
var TaskDetailComponent = (function () {
    function TaskDetailComponent(userService, taskService, route, router) {
        this.userService = userService;
        this.taskService = taskService;
        this.route = route;
        this.router = router;
        this.today = { year: 2017, month: 6, day: 6 };
        this.canTakeInCharge = true;
    }
    TaskDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var date = new Date();
        this.today = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        // On récupère le résident selon l'id
        this.route.params
            .switchMap(function (params) { return _this.taskService.getTaskDate(+params['id']); })
            .subscribe(function (taskDate) {
            _this.taskDate = taskDate;
        });
    };
    return TaskDetailComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", index_1.TaskDate)
], TaskDetailComponent.prototype, "taskDate", void 0);
TaskDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'task_detail.component.html'
    }),
    __metadata("design:paramtypes", [index_2.UserService,
        index_2.TaskService,
        router_1.ActivatedRoute,
        router_1.Router])
], TaskDetailComponent);
exports.TaskDetailComponent = TaskDetailComponent;
//# sourceMappingURL=task_detail.component.js.map