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
var TaskService = (function () {
    function TaskService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    TaskService.prototype.getTaskDate = function (taskDate_id) {
        var headers = new http_1.Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
        var options = new http_1.RequestOptions({ headers: headers });
        // get users from api
        return this.http.get('http://localhost:8000/api/taskdate/' + taskDate_id + '/', options)
            .map(function (response) { return response.json(); });
    };
    TaskService.prototype.getTaskTypes = function () {
        var headers = new http_1.Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get('http://localhost:8000/api/tasktypes/' + localStorage["sector"] + '/', options)
            .map(function (response) { return response.json(); });
    };
    TaskService.prototype.getTaskType = function (pk) {
        var headers = new http_1.Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get('http://localhost:8000/api/tasktype/' + pk + '/', options)
            .map(function (response) { return response.json(); });
    };
    TaskService.prototype.addComment = function (data) {
        var headers = new http_1.Headers({ 'Authorization': 'JWT ' + this.authenticationService.token, 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8000/api/addcomment/', data, options)
            .map(function (response) { return response.json(); });
    };
    return TaskService;
}());
TaskService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        index_1.AuthenticationService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map