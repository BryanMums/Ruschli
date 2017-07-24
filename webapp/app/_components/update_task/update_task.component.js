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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var UpdateTaskComponent = (function () {
    function UpdateTaskComponent(taskService, route, router, _fb) {
        this.taskService = taskService;
        this.route = route;
        this.router = router;
        this._fb = _fb;
        this.taskDate = null;
        this.state = 0;
        this.onlyAtDate = false;
        this.date = null;
        this.taskToAdd = false;
    }
    UpdateTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Permet de récupérer la tâche et la date
        this.route.params.subscribe(function (params) {
            _this.date = params['date'];
            _this.taskService.getTaskDate(params['id'])
                .subscribe(function (taskDate) {
                _this.taskDate = taskDate;
                // On va regarder si c'est une exception ou une tâche périodique
                if ((taskDate.eventType == 0 && taskDate.parent != null) || taskDate.eventType == 1) {
                    // Il faudra choisir entre 2 choix dans le formulaire (Qu'à la date ou à partir de la date)
                    console.log("ahah");
                    _this.myForm = _this._fb.group({
                        type: ['', forms_1.Validators.required]
                    });
                    console.log("hihi");
                    _this.state = 1;
                    // Si c'est une tâche non-périodique
                }
                else {
                    console.log("mdr");
                    _this.state = 2;
                }
            });
        });
    };
    // Méthode appelée dans le cas d'une tâche périodique ou exception.
    UpdateTaskComponent.prototype.chooseTypeModif = function (model, isValid) {
        // Si on choisit de modifier uniquement à la date
        if (model["type"] == 0) {
            this.onlyAtDate = true;
        }
        this.state = 2;
    };
    UpdateTaskComponent.prototype.reset = function () {
        // Revenir sur la page de la tâche
    };
    UpdateTaskComponent = __decorate([
        core_1.Component({
            selector: 'update-task',
            moduleId: module.id,
            templateUrl: 'update_task.component.html'
        }),
        __metadata("design:paramtypes", [index_1.TaskService,
            router_1.ActivatedRoute,
            router_1.Router,
            forms_1.FormBuilder])
    ], UpdateTaskComponent);
    return UpdateTaskComponent;
}());
exports.UpdateTaskComponent = UpdateTaskComponent;
//# sourceMappingURL=update_task.component.js.map