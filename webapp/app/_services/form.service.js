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
require("rxjs/add/operator/map");
var index_1 = require("./index");
var FormService = (function () {
    function FormService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    FormService.prototype.getTaskTypes = function () {
        var sector = localStorage['sector'];
        return this.http.get('http://localhost:8000/api/tasktypes/' + sector + '/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    FormService.prototype.getResidents = function () {
        // get users from api
        return this.http.get('http://localhost:8000/api/resident/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    FormService.prototype.getRooms = function () {
        // get users from api
        return this.http.get('http://localhost:8000/api/room/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    FormService.prototype.getUsers = function () {
        return this.http.get('http://localhost:8000/api/user/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    FormService.prototype.getGroups = function () {
        return this.http.get('http://localhost:8000/api/group/', this.authenticationService.options)
            .map(function (response) { return response.json(); });
    };
    FormService.prototype.addTask = function (data) {
        var headers = new http_1.Headers({ 'Authorization': 'JWT ' + this.authenticationService.token, 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8000/api/createtask/', data, options)
            .map(function (response) { return response.json(); });
    };
    return FormService;
}());
FormService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        index_1.AuthenticationService])
], FormService);
exports.FormService = FormService;
//# sourceMappingURL=form.service.js.map