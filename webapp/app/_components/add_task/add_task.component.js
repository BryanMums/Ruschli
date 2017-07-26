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
var AddTaskComponent = (function () {
    function AddTaskComponent(taskService) {
        this.taskService = taskService;
        this.taskTypes = []; // Liste des types de tâches pouvant être créées
        this.state = 1; // Etat de base à 1 --> Choix du type de tâche, 2 --> Formulaire
        this.taskType = null; // Le type de tâche qui sera sélectionné
        this.taskToAdd = true; // Permet de spécifier au formulaire que l'on veut ajouter et non modifier.
        this.isASectorSelected = true;
    }
    AddTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        // On va récupérer tous les types de tâche
        this.taskService.getTaskTypes()
            .subscribe(function (types) {
            _this.taskTypes = types;
        }, function (err) {
            _this.isASectorSelected = false;
        });
    };
    // Méthode appelée lors du choix du type de tâche
    AddTaskComponent.prototype.chooseType = function (pk) {
        var _this = this;
        // On va récupérer le type
        this.taskService.getTaskType(pk)
            .subscribe(function (taskType) {
            _this.taskType = taskType;
            console.log(taskType);
            // On passe à l'étape du formulaire
            _this.state = 2;
        });
    };
    // Permet de revenir à l'étape du choix de type
    AddTaskComponent.prototype.reset = function () {
        this.state = 1;
    };
    AddTaskComponent = __decorate([
        core_1.Component({
            selector: 'add-task',
            moduleId: module.id,
            templateUrl: 'add_task.component.html'
        }),
        __metadata("design:paramtypes", [index_1.TaskService])
    ], AddTaskComponent);
    return AddTaskComponent;
}());
exports.AddTaskComponent = AddTaskComponent;
//# sourceMappingURL=add_task.component.js.map