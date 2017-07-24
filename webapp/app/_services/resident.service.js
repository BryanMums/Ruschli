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
var ResidentService = (function () {
    function ResidentService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    // Méthode permettant de récupérer la liste des résidents
    ResidentService.prototype.getResidents = function () {
        return this.http.get(this.authenticationService.URL + 'api/resident/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer les informations d'un résident selon son ID
    ResidentService.prototype.getResident = function (resident_id) {
        return this.http.get(this.authenticationService.URL + 'api/resident/' + resident_id + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer les tâches concernant le résident à une date
    ResidentService.prototype.getTaskResident = function (resident_id, date) {
        return this.http.get(this.authenticationService.URL + 'api/tasks_resident/' + date + '/' + resident_id + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    ResidentService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.AuthenticationService])
    ], ResidentService);
    return ResidentService;
}());
exports.ResidentService = ResidentService;
//# sourceMappingURL=resident.service.js.map