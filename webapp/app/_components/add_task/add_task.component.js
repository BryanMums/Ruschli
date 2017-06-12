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
        this.tasks = [];
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
    AddTaskComponent.prototype.ngOnInit = function () {
        var date = new Date();
        this.selDate = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        // On récupère le résident selon l'id
    };
    return AddTaskComponent;
}());
AddTaskComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'add_task.component.html'
    }),
    __metadata("design:paramtypes", [index_1.TaskService])
], AddTaskComponent);
exports.AddTaskComponent = AddTaskComponent;
//# sourceMappingURL=add_task.component.js.map