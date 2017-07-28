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
var router_1 = require("@angular/router");
require("rxjs/add/operator/switchMap");
var index_1 = require("../../_models/index");
var index_2 = require("../../_services/index");
var ResidentComponent = (function () {
    function ResidentComponent(residentService, route, router) {
        this.residentService = residentService;
        this.route = route;
        this.router = router;
        this.tasks = [];
        this.date = null;
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
    ResidentComponent.prototype.ngOnInit = function () {
        var _this = this;
        var date = new Date();
        this.selDate = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        this.date = dateStr;
        // On récupère le résident selon l'id
        this.route.params
            .switchMap(function (params) { return _this.residentService.getResident(+params['id']); })
            .subscribe(function (resident) {
            _this.resident = resident;
            // On récupère les tâches le concernant selon la date.
            _this.updateList();
        });
    };
    // Méthode appelée lorsqu'on change de date dans le date picker
    ResidentComponent.prototype.onDateChanged = function (date) {
        this.date = date.formatted;
        this.updateList();
    };
    // Méthode appelée lorsque l'on clique sur la tâche
    ResidentComponent.prototype.onClickTask = function (pk) {
        // On va aller sur la page de la tâche en spécifiant la date également
        this.router.navigate(['/task', pk, this.date]);
    };
    // Permet de mettre à jour la liste des tâches concernant le résident
    ResidentComponent.prototype.updateList = function () {
        var _this = this;
        this.residentService.getTaskResident(this.resident.pk, this.date)
            .subscribe(function (tasks) {
            _this.tasks = tasks;
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", index_1.Resident)
    ], ResidentComponent.prototype, "resident", void 0);
    ResidentComponent = __decorate([
        core_1.Component({
            selector: 'resident',
            moduleId: module.id,
            templateUrl: 'resident.component.html'
        }),
        __metadata("design:paramtypes", [index_2.ResidentService,
            router_1.ActivatedRoute,
            router_1.Router])
    ], ResidentComponent);
    return ResidentComponent;
}());
exports.ResidentComponent = ResidentComponent;
//# sourceMappingURL=resident.component.js.map