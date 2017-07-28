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
var forms_1 = require("@angular/forms");
var angular2_toaster_1 = require("angular2-toaster");
var router_1 = require("@angular/router");
var FormTaskComponent = (function () {
    function FormTaskComponent(taskService, residentService, roomService, userService, sectorService, _fb, toasterService, route, router) {
        this.taskService = taskService;
        this.residentService = residentService;
        this.roomService = roomService;
        this.userService = userService;
        this.sectorService = sectorService;
        this._fb = _fb;
        this.toasterService = toasterService;
        this.route = route;
        this.router = router;
        // Variables pouvant être données dans le cas d'une création ou modification
        this.taskType = null;
        this.date = null;
        this.taskToAdd = true;
        this.taskDate = null;
        this.onlyAtDate = false;
        this.test = true;
        // Initialisation des dates possibles
        this.start_date = { year: 2017, month: 6, day: 6 };
        this.end_date = { year: 2017, month: 6, day: 6 };
        this.selDate = { year: 2017, month: 6, day: 6 };
        // Tableaux des différents choix
        this.optionsDaysOfWeekModel = [];
        this.optionsResidentsModel = [];
        this.optionsRoomsModel = [];
        this.optionsUsersModel = [];
        this.optionsSectorsModel = [];
        this.optionsCopyUsersModel = [];
        this.optionsCopySectorsModel = [];
        this.optionsWeekNumberModel = null;
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
    FormTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Dans le cas de la modification d'une tâche
        if (!this.taskToAdd && this.taskDate != null) {
            // Si on est sur une tâche exception et qu'on veut modifier à partir de la date
            // Il va falloir mettre les informations de la tâche parente pour la périodicité
            if (!this.onlyAtDate && this.taskDate.parent != null) {
                this.taskService.getTaskDate(this.taskDate.parent)
                    .subscribe(function (taskDate) {
                    _this.taskDate.eventType = taskDate.eventType;
                    _this.taskDate.periodicType = taskDate.periodicType;
                    _this.taskDate.monthlyType = taskDate.monthlyType;
                    _this.taskDate.end_date = taskDate.end_date;
                    _this.taskDate.weekNumber = taskDate.weekNumber;
                    _this.taskDate.daysOfWeek = taskDate.daysOfWeek;
                    _this.taskDate.intervalWeek = taskDate.intervalWeek;
                    _this.taskDate.intervalMonth = taskDate.intervalMonth;
                    _this.taskDate.dayNumber = taskDate.dayNumber;
                });
            }
            // On récupère la date de début comme étant la date à laquelle il veut modifier
            this.start_date = { year: parseInt(this.date.substr(0, 4)), day: parseInt(this.date.substr(8, 2)), month: parseInt(this.date.substr(5, 2)) };
            // On récupère les informations du type de la tâche qu'on veut modifier
            this.taskService.getTaskType(this.taskDate.task.id_type_task)
                .subscribe(function (taskType) {
                _this.taskType = taskType;
                // On va mettre à jour les informations du formulaire par raport à la tâche
                _this.getAllOptions();
            });
            // Dans le cas de la création d'une nouvelle tâche
        }
        else {
            // Récupération de la date actuelle d'aujourd'hui
            var date = new Date();
            this.start_date = { year: date.getUTCFullYear(), day: date.getDate(), month: date.getMonth() + 1 };
            // On va construire une taskDate par rapport au type de la tâche qu'on veut créé
            var task = {};
            task['task'] = {};
            task['task']['title'] = this.taskType.default_title;
            task['task']['description'] = this.taskType.default_description;
            task['task']['need_someone'] = this.taskType.default_need_someone;
            task['task']['resident'] = this.taskType.default_resident;
            task['task']['room'] = this.taskType.default_room;
            task['task']['receiver_user'] = this.taskType.default_receiver_user;
            task['task']['receiver_group'] = this.taskType.default_receiver_group;
            task['task']['copyreceiver_user'] = this.taskType.default_copyreceiver_user;
            task['task']['copyreceiver_group'] = this.taskType.default_copyreceiver_group;
            task['eventType'] = 0;
            task['periodicType'] = 0;
            task['monthlyType'] = 0;
            this.taskDate = task;
            // On va mettre à jour les informations du formulaire par raport à la tâche
            this.getAllOptions();
        }
    };
    // Méthode permettant récupérer les options pour le formulaire et configuer ce dernier
    FormTaskComponent.prototype.getAllOptions = function () {
        var _this = this;
        // Configuration du formulaire
        this.myForm = this._fb.group({
            title: [''],
            description: [''],
            need_someone: [''],
            resident: [''],
            room: [''],
            receiver_user: [''],
            receiver_group: [''],
            copyreceiver_user: [''],
            copyreceiver_group: [''],
            time: [''],
            eventType: [0, forms_1.Validators.required],
            start_date: [this.start_date, forms_1.Validators.required],
            end_date: [this.end_date],
            periodicType: [0],
            daysOfWeek: [''],
            intervalWeek: [''],
            intervalMonth: [''],
            monthlyType: [''],
            dayNumber: [''],
            weekNumber: ['']
        });
        // Va nous servir par la suite
        var that = this;
        // On va récupérer les informations sur les résidents
        this.residentService.getResidents()
            .subscribe(function (residents) {
            residents.forEach(function (resident) {
                that.residentsOptions.push({ id: resident.pk, name: resident.lastname + ' ' + resident.firstname });
            });
            _this.taskDate.task.resident.forEach(function (resident) {
                that.optionsResidentsModel.push(resident.pk);
            });
        });
        // On va récupérer les informations sur les chambres
        this.roomService.getRooms()
            .subscribe(function (rooms) {
            rooms.forEach(function (room) {
                that.roomsOptions.push({ id: room.pk, name: room.title });
            });
            _this.taskDate.task.room.forEach(function (room) {
                that.optionsRoomsModel.push(room.pk);
            });
        });
        // On va récupérer les informations sur les utilisateurs
        this.userService.getUsers()
            .subscribe(function (users) {
            users.forEach(function (user) {
                that.usersOptions.push({ id: user.id, name: user.username });
            });
            _this.taskDate.task.receiver_user.forEach(function (user) {
                that.optionsUsersModel.push(user.id);
            });
            _this.taskDate.task.copyreceiver_user.forEach(function (user) {
                that.optionsCopyUsersModel.push(user.id);
            });
        });
        // On va récupérer les informations sur les secteurs
        this.sectorService.getSectors()
            .subscribe(function (groups) {
            groups.forEach(function (group) {
                that.sectorsOptions.push({ id: group.pk, name: group.title });
            });
            _this.taskDate.task.receiver_group.forEach(function (sector) {
                that.optionsSectorsModel.push(sector.pk);
            });
            _this.taskDate.task.copyreceiver_group.forEach(function (sector) {
                that.optionsCopySectorsModel.push(sector.pk);
            });
        });
    };
    // Méthode permettant de créer ou modifier
    FormTaskComponent.prototype.save = function (model, isValid) {
        var _this = this;
        if (isValid) {
            // On va préparer les informations à envoyer
            var data = {};
            // Informations de base de la tâche
            data['title'] = model.title;
            data['description'] = model.description;
            data['need_someone'] = model.need_someone;
            data['time'] = model.time;
            data['resident'] = this.optionsResidentsModel;
            data['room'] = this.optionsRoomsModel;
            // Informations sur la périodicité
            data['eventType'] = this.taskDate.eventType;
            data['start_date'] = model.start_date.formatted;
            // Si c'est périodique
            if (this.taskDate.eventType == 1) {
                if (model.end_date == null) {
                    data["end_date"] = null;
                }
                else {
                    if (model.end_date.formatted == '0-00-00') {
                        data['end_date'] = null;
                    }
                    else {
                        data['end_date'] = model.end_date.formatted;
                    }
                }
                data['periodicType'] = this.taskDate.periodicType;
                // Si c'est quotidien ou annuel, on ne fait rien de plus
                // Si c'est hebdomadaire
                if (this.taskDate.periodicType == 1) {
                    data['daysOfWeek'] = model.daysOfWeek;
                    data['intervalWeek'] = model.intervalWeek;
                }
                else if (this.taskDate.periodicType == 2) {
                    data['monthlyType'] = this.taskDate.monthlyType;
                    data['intervalMonth'] = model.intervalMonth;
                    // Si c'est daydate
                    if (data['monthlyType'] == 0) {
                        data['dayNumber'] = model.dayNumber;
                    }
                    else if (data['monthlyType'] == 1) {
                        data['weekNumber'] = model.weekNumber;
                        data['daysOfWeek'] = model.daysOfWeek;
                    }
                }
            }
            // Informations sur les destinataires
            data['receiver_user'] = this.optionsUsersModel;
            data['receiver_group'] = this.optionsSectorsModel;
            data['copyreceiver_user'] = this.optionsCopyUsersModel;
            data['copyreceiver_group'] = this.optionsCopySectorsModel;
            // Information sur le type de tâche
            data['id_type_task'] = this.taskType.pk;
            // Dans le cas d'une création d'une nouvelle tâche
            if (this.taskToAdd) {
                console.log(data);
                // On crée la tâche sur l'API
                this.taskService.addTask(data)
                    .subscribe(function (response) {
                    if (response.pk != null) { }
                    _this.toasterService.pop('success', 'Ajout réussi', 'La nouvelle tâche a bien été créée');
                    _this.router.navigate(['/home']);
                }, function (err) {
                    _this.toasterService.pop('error', 'Ajout a échoué', 'Une erreur s\'est produite !');
                });
                // Dans le cas d'une modification d'une tâche
            }
            else {
                // On doit donner d'autres informations lors d'une modification
                var post = {};
                post['values'] = data;
                post['taskdate'] = this.taskDate.pk;
                post['onlyAtDate'] = this.onlyAtDate;
                post['date'] = this.date;
                console.log(post);
                // On met à jour sur l'API
                this.taskService.updateTask(post)
                    .subscribe(function (response) {
                    _this.toasterService.pop('success', 'Modification réussie', 'La tâche a bien été modifiée');
                    _this.router.navigate(['/home', _this.date]);
                }, function (err) {
                    _this.toasterService.pop('error', 'Modification échouée', 'La tâche n\'a pas pu être modifiée');
                });
            }
        }
    };
    // Méthode permettant de changer le type (non-périodique ou périodique)
    FormTaskComponent.prototype.setEventType = function (id) {
        this.taskDate.eventType = id;
    };
    // Méthode permettant de changer le type de périodicité
    FormTaskComponent.prototype.setPeriodicType = function (id) {
        this.taskDate.periodicType = id;
    };
    // Méthode permettant de changer le type de périodicité mensuelle
    FormTaskComponent.prototype.setMonthlyType = function (id) {
        this.taskDate.monthlyType = id;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", index_1.TaskType)
    ], FormTaskComponent.prototype, "taskType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FormTaskComponent.prototype, "date", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormTaskComponent.prototype, "taskToAdd", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FormTaskComponent.prototype, "taskDate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FormTaskComponent.prototype, "onlyAtDate", void 0);
    FormTaskComponent = __decorate([
        core_1.Component({
            selector: 'form-task',
            moduleId: module.id,
            templateUrl: 'form_task.component.html'
        }),
        __metadata("design:paramtypes", [index_2.TaskService,
            index_2.ResidentService,
            index_2.RoomService,
            index_2.UserService,
            index_2.SectorService,
            forms_1.FormBuilder,
            angular2_toaster_1.ToasterService,
            router_1.ActivatedRoute,
            router_1.Router])
    ], FormTaskComponent);
    return FormTaskComponent;
}());
exports.FormTaskComponent = FormTaskComponent;
//# sourceMappingURL=form_task.component.js.map