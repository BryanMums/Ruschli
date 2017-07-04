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
var forms_1 = require("@angular/forms");
var TaskDetailComponent = (function () {
    function TaskDetailComponent(userService, taskService, route, router, _fb) {
        this.userService = userService;
        this.taskService = taskService;
        this.route = route;
        this.router = router;
        this._fb = _fb;
        this.today = { year: 2017, month: 6, day: 6 };
        this.canTakeInCharge = true;
    }
    TaskDetailComponent.prototype.ngOnInit = function () {
        var date = new Date();
        this.today = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        // On récupère le résident selon l'id
        this.myForm = this._fb.group({
            text: ['', forms_1.Validators.required]
        });
        console.log("ID: " + this.taskDate.pk);
    };
    TaskDetailComponent.prototype.addComment = function (model, isValid) {
        var _this = this;
        console.log(model.text, this.date, this.taskDate.pk);
        var data = {};
        data["text"] = model.text;
        data["date"] = this.date;
        data["taskdate"] = this.taskDate.pk;
        this.taskService.addComment(data)
            .subscribe(function (taskDate) {
            if (taskDate.pk != null) {
                _this.taskDate = taskDate;
            }
            else {
                console.log("Erreur");
            }
        });
        this.myForm = this._fb.group({
            text: ['', forms_1.Validators.required]
        });
    };
    TaskDetailComponent.prototype.take = function () {
        var _this = this;
        console.log("Je m'en occupe !");
        var data = {};
        data["sector"] = localStorage["sector"];
        data["taskdate"] = this.taskDate.pk;
        data["date"] = this.date;
        this.taskService.addTaker(data)
            .subscribe(function (taskDate) {
            if (taskDate.pk != null) {
                _this.taskDate = taskDate;
            }
            else {
                console.log("Erreur");
            }
        });
    };
    return TaskDetailComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TaskDetailComponent.prototype, "date", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", index_1.TaskDate)
], TaskDetailComponent.prototype, "taskDate", void 0);
TaskDetailComponent = __decorate([
    core_1.Component({
        selector: 'task-detail',
        moduleId: module.id,
        templateUrl: 'task_detail.component.html'
    }),
    __metadata("design:paramtypes", [index_2.UserService,
        index_2.TaskService,
        router_1.ActivatedRoute,
        router_1.Router,
        forms_1.FormBuilder])
], TaskDetailComponent);
exports.TaskDetailComponent = TaskDetailComponent;
//# sourceMappingURL=task_detail.component.js.map