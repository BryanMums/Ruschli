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
var router_1 = require("@angular/router");
require("rxjs/add/operator/switchMap");
var forms_1 = require("@angular/forms");
var angular2_toaster_1 = require("angular2-toaster");
var StopTaskComponent = (function () {
    function StopTaskComponent(TaskService, _fb, taskService, route, router, toasterService) {
        this.TaskService = TaskService;
        this._fb = _fb;
        this.taskService = taskService;
        this.route = route;
        this.router = router;
        this.toasterService = toasterService;
        this.taskDate = null;
        this.s = 0;
        this.onlyAtDate = false;
        this.date = null;
        this.taskToAdd = false;
        this.included_date = false;
    }
    StopTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.date = params['date'];
            _this.taskService.getTaskDate_date(+params['id'], _this.date)
                .subscribe(function (taskDate) {
                _this.taskDate = taskDate;
                _this.taskService.getPermissions(_this.taskDate.pk)
                    .subscribe(function (data) {
                    if (data.can_update == false) {
                        // Redirige l'utilisateur sur la page de tâche.
                    }
                });
            });
        });
    };
    StopTaskComponent.prototype.reset = function () {
        // Rediriger sur la page de la tâche
        this.router.navigate(['/task', this.taskDate.pk, this.date]);
    };
    StopTaskComponent.prototype.stop = function () {
        var _this = this;
        // On va préparer les données à envoyer selon les choix de l'utilisateur
        var data = {};
        data["taskdate"] = this.taskDate.pk;
        data["type"] = this.onlyAtDate;
        data["includeDate"] = this.included_date;
        data["date"] = this.date;
        // On arrête la tâche
        this.taskService.stopTaskDate(data)
            .subscribe(function (response) {
            _this.router.navigate(['home', _this.date]);
            // On va revenir sur la liste des tâches à la bonne date
        }, function (err) {
        });
    };
    StopTaskComponent = __decorate([
        core_1.Component({
            selector: 'stop-task',
            moduleId: module.id,
            templateUrl: 'stop_task.component.html'
        }),
        __metadata("design:paramtypes", [index_1.TaskService,
            forms_1.FormBuilder,
            index_1.TaskService,
            router_1.ActivatedRoute,
            router_1.Router,
            angular2_toaster_1.ToasterService])
    ], StopTaskComponent);
    return StopTaskComponent;
}());
exports.StopTaskComponent = StopTaskComponent;
//# sourceMappingURL=stop_task.component.js.map