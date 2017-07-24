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
var http_1 = require("@angular/http");
var index_1 = require("./index");
require("rxjs/add/operator/map");
var TaskService = (function () {
    function TaskService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    // Méthode permettant de récupérer les tâches d'un utilisateur selon une date et un secteur
    TaskService.prototype.getTasks = function (date) {
        var sector = localStorage["sector"];
        return this.http.get(this.authenticationService.URL + 'api/tasks/' + date + '/' + sector + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer une TaskDate/Apparition selon son ID
    TaskService.prototype.getTaskDate = function (taskDate_id) {
        return this.http.get(this.authenticationService.URL + 'api/taskdate/' + taskDate_id + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer les types de tâches selon son secteur de travail
    TaskService.prototype.getTaskTypes = function () {
        var sector = localStorage['sector'];
        return this.http.get(this.authenticationService.URL + 'api/tasktypes/' + sector + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer les informations d'un type de tâche selon son ID
    TaskService.prototype.getTaskType = function (pk) {
        return this.http.get(this.authenticationService.URL + 'api/tasktype/' + pk + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant d'ajouter un commentaire à une TaskDate/Apparition
    TaskService.prototype.addComment = function (data) {
        return this.http.post(this.authenticationService.URL + 'api/addcomment/', data, this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant d'ajouter l'utilisateur comme "preneur" d'une TaskDate
    TaskService.prototype.addTaker = function (data) {
        return this.http.post(this.authenticationService.URL + 'api/addtaker/', data, this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant d'arrêter une tâche
    TaskService.prototype.stopTaskDate = function (data) {
        return this.http.post(this.authenticationService.URL + 'api/stoptask/', data, this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant d'ajouter une tâche
    TaskService.prototype.addTask = function (data) {
        return this.http.post(this.authenticationService.URL + 'api/createtask/', data, this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de mettre à jour une tâche
    TaskService.prototype.updateTask = function (data) {
        return this.http.post(this.authenticationService.URL + 'api/updatetask/', data, this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    TaskService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.AuthenticationService])
    ], TaskService);
    return TaskService;
}());
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map