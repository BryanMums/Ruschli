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
var HomeComponent = (function () {
    function HomeComponent(taskService, router) {
        this.taskService = taskService;
        this.router = router;
        this.tasks = []; // La liste des tâches
        this.date = null; // La date qui sera sélectionnée utilisée pour les appels à l'API
        this.selDate = { year: 2017, month: 6, day: 6 }; // La date sélectionnée dans le date picker
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
        // On va prendre la date d'aujourd'hui et la formatter pour le date picker et l'appel API
        var date = new Date();
        this.selDate = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        this.date = dateStr;
        // On met à jour à la liste des tâches selon la date
        this.updateList();
    };
    // Méthode appelée lorsque la date du date picker change
    HomeComponent.prototype.onDateChanged = function (date) {
        // On met à jour la date formattée
        this.date = date.formatted;
        // On met à jour à la liste des tâches selon la date
        this.updateList();
    };
    // Méthode appelée lorsque l'on clique sur la tâche
    HomeComponent.prototype.onClickTask = function (pk) {
        // On va aller sur la page de la tâche en spécifiant la date également
        this.router.navigate(['/task', pk, this.date]);
    };
    // Méthode appelée permettant de mettre à jour la liste des tâches
    HomeComponent.prototype.updateList = function () {
        var _this = this;
        this.taskService.getTasks(this.date)
            .subscribe(function (tasks) {
            _this.tasks = tasks;
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'home.component.html'
        }),
        __metadata("design:paramtypes", [index_1.TaskService,
            router_1.Router])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map