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
var UserService = (function () {
    function UserService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    // Méthode permettant de récupérer la liste des utilisateurs (employés)
    UserService.prototype.getUsers = function () {
        return this.http.get(this.authenticationService.URL + 'api/user/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer les informations de l'utilisateur connecté
    UserService.prototype.getConnectedUser = function () {
        return this.http.get(this.authenticationService.URL + 'api/get_connected_user/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de récupérer les tâches destinées à l'utilisateur et son secteur sélectionné
    UserService.prototype.getTasks = function (date) {
        var sector = localStorage["sector"];
        return this.http.get(this.authenticationService.URL + 'api/tasks/' + date + '/' + sector + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    UserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.AuthenticationService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map