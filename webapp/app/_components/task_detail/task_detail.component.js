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
var angular2_toaster_1 = require("angular2-toaster");
var TaskDetailComponent = (function () {
    function TaskDetailComponent(taskService, route, router, _fb, toasterService) {
        this.taskService = taskService;
        this.route = route;
        this.router = router;
        this._fb = _fb;
        this.toasterService = toasterService;
        this.can_take = false;
        this.can_update = false;
        this.can_comment = false;
        this.repetition = "";
        this.parent = null;
        this.days = [
            'Lundi. ',
            'Mardi. ',
            'Mercredi. ',
            'Jeudi. ',
            'Vendredi. ',
            'Samedi. ',
            'Dimanche. '
        ];
        // Options pour le choix de quelle semaine
        this.weekNumber = [
            'Premier',
            'Deuxième',
            'Troisième',
            'Quatrième',
            'Cinquième'
        ];
    }
    TaskDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        // On récupère le résident selon l'id
        this.myForm = this._fb.group({
            text: ['', forms_1.Validators.required]
        });
        // On récupère la tâche et la date
        this.route.params.subscribe(function (params) {
            _this.date = params['date'];
            _this.taskService.getTaskDate_date(+params['id'], _this.date)
                .subscribe(function (taskDate) {
                _this.taskDate = taskDate;
                if (_this.taskDate.parent != null) {
                    _this.taskService.getTaskDate(_this.taskDate.parent)
                        .subscribe(function (parent) {
                        _this.parent = parent;
                        _this.initPeriodicity();
                        _this.taskService.getPermissions(taskDate.pk)
                            .subscribe(function (data) {
                            _this.can_take = data.can_take;
                            _this.can_update = data.can_update;
                            _this.can_comment = data.can_comment;
                        });
                    });
                }
                else {
                    _this.initPeriodicity();
                    _this.taskService.getPermissions(taskDate.pk)
                        .subscribe(function (data) {
                        console.log(data);
                        _this.can_take = data.can_take;
                        _this.can_update = data.can_update;
                        _this.can_comment = data.can_comment;
                    });
                }
            });
        });
    };
    // Méthode permettant d'ajouter un commentaire
    TaskDetailComponent.prototype.addComment = function (model, isValid) {
        var _this = this;
        if (isValid) {
            // On prépare les données à envoyer
            var data = {};
            data["text"] = model.text;
            data["date"] = this.date;
            data["taskdate"] = this.taskDate.pk;
            console.log(data);
            // On envoie à l'API le commentaire
            this.taskService.addComment(data)
                .subscribe(function (taskDate) {
                if (taskDate.pk != null) {
                    // On met à jour la tâche
                    _this.taskDate = taskDate;
                    _this.toasterService.pop('success', 'Commentaire ajouté', 'Votre commentaire a bien été enregistré !');
                    // On remet le formulaire à 0
                    _this.myForm = _this._fb.group({
                        text: ['', forms_1.Validators.required]
                    });
                }
                else {
                    _this.toasterService.pop('error', 'Commentaire refusé', 'Votre commentaire n\'a pas pu être enregistré !');
                }
            });
        }
    };
    // Méthode permettant de prendre en charge une tâche
    TaskDetailComponent.prototype.take = function () {
        var _this = this;
        // On prépare les données à envoyer à l'API
        var data = {};
        data["sector"] = localStorage["sector"];
        data["taskdate"] = this.taskDate.pk;
        data["date"] = this.date;
        // On envoie à l'API pour dire que l'utilisateur s'occupe de la tâche
        this.taskService.addTaker(data)
            .subscribe(function (taskDate) {
            if (taskDate.pk != null) {
                // On met à jour les infos de la tâche
                _this.taskDate = taskDate;
                _this.toasterService.pop('success', 'S\'occuper de la tâche', 'Vous vous occupez de la tâche !');
            }
            else {
                _this.toasterService.pop('error', 'S\'occuper de la tâche', 'Une erreur s\'est produite, veuillez recharger la page');
            }
        }, function (err) {
            _this.toasterService.pop('error', 'S\'occuper de la tâche', 'Une erreur s\'est produite, veuillez recharger la page');
        });
    };
    // Méthode appelée pour permettre la modification
    TaskDetailComponent.prototype.openModif = function () {
        // On affiche la page de modification d'une tâche
        this.router.navigate(['/update-task', this.taskDate.pk, this.date]);
    };
    // Méthode appelée pour permettre d'arrêter la tâche
    TaskDetailComponent.prototype.openStop = function () {
        // On affiche la page d'arrêt d'une tâche
        this.router.navigate(['/stop-task', this.taskDate.pk, this.date]);
    };
    // Méthode appelée pour permettre de réactiver la tâche
    TaskDetailComponent.prototype.reactivate = function () {
        var _this = this;
        this.taskService.activateTaskDate(this.taskDate.pk, this.date)
            .subscribe(function (response) {
            _this.toasterService.pop('success', 'Activation de la tâche', 'La tâche a bien été réactivée !');
        }, function (err) {
            _this.toasterService.pop('error', 'activation de la tâche', 'Une erreur s\'est produite !');
        });
    };
    TaskDetailComponent.prototype.translatePeriodicity = function (taskDate) {
        if (taskDate.eventType == 0) {
            this.repetition += "Tâche non périodique. ";
        }
        else {
            this.repetition += "Tâche périodique ";
            if (taskDate.periodicType == 0) {
                this.repetition += "quotidienne. ";
            }
            else if (taskDate.periodicType == 1) {
                this.repetition += "hebdomadaire. ";
                var that_1 = this;
                taskDate.daysOfWeek.forEach(function (day) {
                    that_1.repetition += that_1.days[day];
                });
                this.repetition += "Tous les " + (taskDate.intervalWeek > 1 ? taskDate.intervalWeek : '') + " semaines.";
            }
            else if (taskDate.periodicType == 2) {
                this.repetition += "mensuelle. ";
                if (taskDate.monthlyType == 0) {
                    this.repetition += "Tous les " + taskDate.dayNumber + " du mois. ";
                }
                else {
                    var that_2 = this;
                    taskDate.daysOfWeek.forEach(function (day) {
                        that_2.repetition += that_2.days[day];
                    });
                    this.repetition += that_2.weekNumber[taskDate.weekNumber] + " du mois. ";
                }
                this.repetition += "Tous les " + (taskDate.intervalMonth > 1 ? taskDate.intervalMonth : '') + " mois.";
            }
            else {
                this.repetition += "annuelle. ";
            }
        }
        if (taskDate.eventType == 1) {
            this.repetition += "Date de début : " + taskDate.start_date + ". ";
            if (taskDate.end_date) {
                this.repetition += "Date de fin : " + taskDate.end_date + ". ";
            }
        }
    };
    TaskDetailComponent.prototype.initPeriodicity = function () {
        // Si c'est une apparition exception, il faudra prendre celle de son parent
        if (this.taskDate.eventType == 0 && this.parent != null) {
            this.translatePeriodicity(this.parent);
        }
        else {
            this.translatePeriodicity(this.taskDate);
        }
    };
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
        __metadata("design:paramtypes", [index_2.TaskService,
            router_1.ActivatedRoute,
            router_1.Router,
            forms_1.FormBuilder,
            angular2_toaster_1.ToasterService])
    ], TaskDetailComponent);
    return TaskDetailComponent;
}());
exports.TaskDetailComponent = TaskDetailComponent;
//# sourceMappingURL=task_detail.component.js.map