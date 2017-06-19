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
var AddTaskComponent = (function () {
    function AddTaskComponent(taskService, formService, _fb, route, router) {
        this.taskService = taskService;
        this.formService = formService;
        this._fb = _fb;
        this.route = route;
        this.router = router;
        this.taskTypes = [];
        this.state = 1;
        this.taskType = null;
        this.selectedSector = 0;
        // Tableaux des différents choix
        this.optionsDaysOfWeekModel = [];
        this.optionsResidentsModel = [];
        this.optionsRoomsModel = [];
        this.optionsUsersModel = [];
        this.optionsSectorsModel = [];
        this.optionsCopyUsersModel = [];
        this.optionsCopySectorsModel = [];
        this.optionsWeekNumberModel = [];
        // Options pour le choix des jours
        this.daysOptions = [
            { id: 0, name: 'Lundi' },
            { id: 1, name: 'Mardi' },
            { id: 2, name: 'Mercredi' },
            { id: 3, name: 'Jeudi' },
            { id: 4, name: 'Vendredi' },
            { id: 5, name: 'Samedi' },
            { id: 6, name: 'Dimanche' },
        ];
        // Options pour le choix de quelle semaine
        this.weekNumberOptions = [
            { id: 0, name: 'Première' },
            { id: 1, name: 'Deuxième' },
            { id: 2, name: 'Troisième' },
            { id: 3, name: 'Quatrième' },
            { id: 4, name: 'Cinquième' }
        ];
        // Options pour le choix des résidents
        this.residentsOptions = [];
        // Options pour le choix des chambres
        this.roomsOptions = [];
        // Options pour le choix des utilisateurs
        this.usersOptions = [];
        // Options pour le choix des secteurs
        this.sectorsOptions = [];
        // Paramètres sans la fonction de recherche
        this.nosearchSettings = {
            enableSearch: false,
            buttonClasses: 'btn btn-block btn-default',
            dynamicTitleMaxItems: 3,
            displayAllSelectedText: true
        };
        // Paramètres avec la fonction de recherche
        this.searchSettings = {
            enableSearch: true,
            buttonClasses: 'btn btn-block btn-default',
            dynamicTitleMaxItems: 3,
            displayAllSelectedText: true
        };
        // Paramètres sans la fonction de recherche et choix unique
        this.nosearchUniqueSettings = {
            enableSearch: false,
            buttonClasses: 'btn btn-block btn-default',
            selectionLimit: 1,
            dynamicTitleMaxItems: 1,
            displayAllSelectedText: true
        };
        this.selDate = { year: 2017, month: 6, day: 6 };
        this.myDatePickerOptions = {
            dateFormat: 'yyyy-mm-dd',
            dayLabels: { su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam' },
            todayBtnTxt: 'Aujourd\'ĥui',
            editableDateField: false,
            showClearDateBtn: true,
            showIncreaseDateBtn: true,
            showDecreaseDateBtn: true,
            openSelectorOnInputClick: true
        };
        this.EVENT_TYPES = {
            NONPERIODIC: { id: 0, name: "Non périodique" },
            PERIODIC: { id: 1, name: "Périodique" }
        };
        this.PERIODIC_TYPES = {
            QUOTIDIEN: { id: 0, name: "Quotidien" },
            HEBDOMADAIRE: { id: 1, name: "Hebdomadaire" },
            MENSUEL: { id: 2, name: "Mensuel" },
            ANNUEL: { id: 3, name: "Annuel" }
        };
        this.MONTHLY_TYPES = {
            DAYDATE: { id: 0, name: "La date répété" },
            DAYNUMBERWEEK: { id: 1, name: "Le(s) jour(s) de la combientième semaine" }
        };
    }
    AddTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Récupération de la date actuelle et configuration par rapport à la date.
        var date = new Date();
        this.selDate = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
        var dateStr = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        // On va récupérer les types de tâches
        this.formService.getTaskTypes()
            .subscribe(function (types) {
            _this.taskTypes = types;
        });
    };
    AddTaskComponent.prototype.chooseType = function (pk) {
        var _this = this;
        this.taskService.getTaskType(pk)
            .subscribe(function (taskType) {
            _this.taskType = taskType;
            console.log(_this.taskType);
            // Configuration du formulaire
            _this.myForm = _this._fb.group({
                title: [_this.taskType.default_title, forms_1.Validators.required],
                description: [_this.taskType.default_description],
                need_someone: [_this.taskType.default_need_someone],
                resident: [''],
                room: [''],
                receiver_user: [''],
                receiver_group: [''],
                copyreceiver_user: [''],
                copyreceiver_group: [''],
                time: [_this.taskType.time],
                eventType: _this.initEventFormGroup(),
            });
            // Va nous servir par la suite
            var that = _this;
            // On va écouter les changements au niveau de la périodicité
            _this.subscribeEventTypeChanges();
            _this.subscribePeriodicTypeChanges();
            _this.subscribeMonthlyTypeChanges();
            // Permet de mettre à défaut les valeurs pour la périodicité
            _this.setEventType(_this.EVENT_TYPES.NONPERIODIC);
            _this.setPeriodicType(_this.PERIODIC_TYPES.QUOTIDIEN);
            _this.setMonthlyType(_this.MONTHLY_TYPES.DAYDATE);
            // On va récupérer les informations sur les résidents
            _this.formService.getResidents()
                .subscribe(function (residents) {
                residents.forEach(function (resident) {
                    that.residentsOptions.push({ id: resident.pk, name: resident.lastname + ' ' + resident.firstname });
                });
                _this.taskType.default_resident.forEach(function (resident) {
                    that.optionsResidentsModel.push(resident.pk);
                });
            });
            // On va récupérer les informations sur les chambres
            _this.formService.getRooms()
                .subscribe(function (rooms) {
                rooms.forEach(function (room) {
                    that.roomsOptions.push({ id: room.pk, name: room.title });
                });
                _this.taskType.default_room.forEach(function (room) {
                    that.optionsRoomsModel.push(room.pk);
                });
            });
            // On va récupérer les informations sur les utilisateurs
            _this.formService.getUsers()
                .subscribe(function (users) {
                users.forEach(function (user) {
                    that.usersOptions.push({ id: user.id, name: user.username });
                    console.log(that.usersOptions);
                });
                _this.taskType.default_receiver_user.forEach(function (user) {
                    that.optionsUsersModel.push(user.pk);
                });
                _this.taskType.default_copyreceiver_user.forEach(function (user) {
                    that.optionsCopyUsersModel.push(user.pk);
                });
            });
            // On va récupérer les informations sur les secteurs
            _this.formService.getGroups()
                .subscribe(function (groups) {
                groups.forEach(function (group) {
                    that.sectorsOptions.push({ id: group.pk, name: group.title });
                });
                _this.taskType.default_receiver_group.forEach(function (sector) {
                    that.optionsSectorsModel.push(sector.pk);
                });
                _this.taskType.default_copyreceiver_group.forEach(function (sector) {
                    that.optionsCopySectorsModel.push(sector.pk);
                });
            });
        });
        this.state = 2;
    };
    AddTaskComponent.prototype.save = function (model, isValid) {
        var _this = this;
        //console.log(model, isValid);
        // On va transformer notre TaskInterface.
        var data = {};
        // Informations de base de la tâche
        data['title'] = model.title;
        data['description'] = model.description;
        data['need_someone'] = model.need_someone;
        data['time'] = model.time;
        data['resident'] = this.optionsResidentsModel;
        data['room'] = this.optionsRoomsModel;
        // Informations sur la périodicité
        data['eventType'] = model.eventType.type.id;
        // Si c'est non-périodique
        if (model.eventType.type == this.EVENT_TYPES.NONPERIODIC) {
            data['start_date'] = model.eventType.nonperiodic.date.formatted;
        }
        else if (model['eventType'].type == this.EVENT_TYPES.PERIODIC) {
            data['start_date'] = model.eventType.periodic.start_date.formatted;
            data['end_date'] = model.eventType.periodic.end_date.formatted;
            data['periodicType'] = model.eventType.periodic.type.id;
            // Si c'est quotidien ou annuel, on ne fait rien de plus
            // Si c'est hebdomadaire
            if (model.eventType.periodic.type == this.PERIODIC_TYPES.HEBDOMADAIRE) {
                data['daysOfWeek'] = model.eventType.periodic.hebdomadaire.daysOfWeek;
                data['intervalWeek'] = model.eventType.periodic.hebdomadaire.intervalWeek;
            }
            else if (model.eventType.periodic.type == this.PERIODIC_TYPES.MENSUEL) {
                data['intervalMonth'] = model.eventType.periodic.mensuel.intervalMonth;
                // Si c'est daydate
                if (model.eventType.periodic.mensuel.monthlyType.type == this.MONTHLY_TYPES.DAYDATE) {
                    data['dayNumber'] = model.eventType.periodic.mensuel.monthlyType.daydate.dayNumber;
                }
                else if (model.eventType.periodic.mensuel.monthlyType.type == this.MONTHLY_TYPES.DAYNUMBERWEEK) {
                    data['weekNumber'] = model.eventType.periodic.mensuel.monthlyType.daynumberweek.weekNumber;
                    data['daysOfWeek'] = model.eventType.periodic.mensuel.monthlyType.daynumberweek.daysOfWeek;
                }
            }
        }
        // Informations sur les destinataires
        data['receiver_user'] = this.optionsUsersModel;
        data['receiver_group'] = this.optionsCopyUsersModel;
        data['copyreceiver_user'] = this.optionsCopyUsersModel;
        data['copyreceiver_group'] = this.optionsCopySectorsModel;
        console.log(data);
        this.formService.addTask(data)
            .subscribe(function (response) {
            if (response.pk != null) {
                console.log(response);
                console.log("Ca a marché !");
                _this.router.navigate(['/task', response.pk]);
            }
            else {
                console.log(response);
                console.log("Il y a une erreur !");
            }
        });
    };
    AddTaskComponent.prototype.initEventFormGroup = function () {
        var group = this._fb.group({
            type: [''],
            nonperiodic: this._fb.group(this.initEventNonPeriodicModel()),
            periodic: this._fb.group(this.initEventPeriodicModel()),
        });
        return group;
    };
    AddTaskComponent.prototype.initEventNonPeriodicModel = function () {
        var model = {
            date: [this.selDate, forms_1.Validators.required]
        };
        return model;
    };
    AddTaskComponent.prototype.initEventPeriodicModel = function () {
        var model = {
            type: ['', forms_1.Validators.required],
            start_date: [this.selDate, forms_1.Validators.required],
            end_date: [null],
            quotidien: [''],
            hebdomadaire: this._fb.group(this.initHebdomadaireModel()),
            mensuel: this._fb.group(this.initMensuelModel()),
            annuel: ['']
        };
        return model;
    };
    AddTaskComponent.prototype.initHebdomadaireModel = function () {
        var model = {
            daysOfWeek: [''],
            intervalWeek: [1]
        };
        return model;
    };
    AddTaskComponent.prototype.initMensuelModel = function () {
        var model = {
            type: [''],
            intervalMonth: [1],
            daydate: this._fb.group(this.initMonthlyDayDateModel()),
            daynumberweek: this._fb.group(this.initMonthlyDayNumberWeekModel())
        };
        return model;
    };
    AddTaskComponent.prototype.initMonthlyDayDateModel = function () {
        var model = {
            dayNumber: [1]
        };
        return model;
    };
    AddTaskComponent.prototype.initMonthlyDayNumberWeekModel = function () {
        var model = {
            weekNumber: [''],
            daysOfWeek: ['']
        };
        return model;
    };
    AddTaskComponent.prototype.setEventType = function (type) {
        var ctrl = this.myForm.controls.eventType.controls.type;
        ctrl.setValue(type);
    };
    AddTaskComponent.prototype.setPeriodicType = function (type) {
        console.log(this.myForm.controls.eventType);
        var ctrl = this.myForm.controls.eventType.controls.periodic.controls.type;
        ctrl.setValue(type);
    };
    AddTaskComponent.prototype.setMonthlyType = function (type) {
        var ctrl = this.myForm.controls.eventType.controls.periodic.controls.mensuel.controls.type;
        ctrl.setValue(type);
    };
    AddTaskComponent.prototype.subscribeEventTypeChanges = function () {
        var _this = this;
        var evCtrl = this.myForm.controls.eventType;
        var nonpCtrl = evCtrl.controls.nonperiodic;
        var periCtrl = evCtrl.controls.periodic;
        var changes$ = evCtrl.controls.type.valueChanges;
        changes$.subscribe(function (eventType) {
            //NONPERIODIC
            if (eventType === _this.EVENT_TYPES.NONPERIODIC) {
                // apply validators to each bank fields, retrieve validators from bank model
                Object.keys(nonpCtrl.controls).forEach(function (key) {
                    nonpCtrl.controls[key].setValidators(_this.initEventNonPeriodicModel()[key][1]);
                    nonpCtrl.controls[key].updateValueAndValidity();
                });
                // remove all validators from card fields
                Object.keys(periCtrl.controls).forEach(function (key) {
                    periCtrl.controls[key].setValidators(null);
                    periCtrl.controls[key].updateValueAndValidity();
                });
            }
            //PERIODIC
            if (eventType === _this.EVENT_TYPES.PERIODIC) {
                // apply validators to each bank fields, retrieve validators from bank model
                Object.keys(periCtrl.controls).forEach(function (key) {
                    periCtrl.controls[key].setValidators(_this.initEventPeriodicModel()[key][1]);
                    periCtrl.controls[key].updateValueAndValidity();
                });
                // remove all validators from card fields
                Object.keys(nonpCtrl.controls).forEach(function (key) {
                    nonpCtrl.controls[key].setValidators(null);
                    console.log(key);
                    nonpCtrl.controls[key].updateValueAndValidity();
                });
            }
        });
    };
    AddTaskComponent.prototype.subscribePeriodicTypeChanges = function () {
        var peCtrl = this.myForm.controls.eventType.controls.periodic;
    };
    AddTaskComponent.prototype.subscribeMonthlyTypeChanges = function () {
        var moCtrl = this.myForm.controls.eventType.controls.periodic.controls.mensuel;
        var changes$ = moCtrl.controls.type.valueChanges;
        changes$.subscribe(function (monthlyType) {
            console.log("Il y a un changement de monthlyType");
        });
    };
    return AddTaskComponent;
}());
AddTaskComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'add_task.component.html'
    }),
    __metadata("design:paramtypes", [index_1.TaskService,
        index_1.FormService,
        forms_1.FormBuilder,
        router_1.ActivatedRoute,
        router_1.Router])
], AddTaskComponent);
exports.AddTaskComponent = AddTaskComponent;
//# sourceMappingURL=add_task.component.js.map