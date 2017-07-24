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
var http_2 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var angular2_toaster_1 = require("angular2-toaster");
require("rxjs/add/operator/map");
var AuthenticationService = (function () {
    function AuthenticationService(http, toasterService) {
        this.http = http;
        this.toasterService = toasterService;
        this.URL = "http://localhost:8000/";
        // S'il existe un token en storage local
        if (localStorage['token']) {
            this.token = localStorage['token'];
        }
        else {
            this.token = null;
        }
        // On configure les en-têtes pour les appels à l'API
        this.headers = new http_2.Headers({ 'Authorization': 'JWT ' + this.token, "Content-Type": "application/json" });
        this.options = new http_2.RequestOptions({ headers: this.headers });
    }
    // Méthode permettant de s'authentifier à l'API
    AuthenticationService.prototype.login = function (credentials) {
        var _this = this;
        var body = JSON.stringify(credentials);
        return this.http.post(this.URL + 'api-jwt-auth/', body, this.options)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            // On va enregistrer le token et les différentes entités permettant de faire des appels à l'API
            _this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('sector', '0');
            _this.headers = new http_2.Headers({ 'Authorization': 'JWT ' + _this.token, "Content-Type": "application/json" });
            _this.options = new http_2.RequestOptions({ headers: _this.headers });
            _this.toasterService.pop('success', 'Connexion réussie', 'La connexion a réussi ! Bienvenue !');
        }, function (err) {
            _this.toasterService.pop('error', 'Connexion échouée', 'Vos informations de connexion sont faux !');
        });
    };
    // Méthode permettant de récupérer les informations de l'utilisateur connecté
    AuthenticationService.prototype.getUser = function () {
        return this.http.get(this.URL + 'api/get_connected_user/', this.options)
            .map(function (response) { return response.json(); });
    };
    // Méthode permettant de se déconnecter
    AuthenticationService.prototype.logout = function () {
        // On enlève les différentes valeurs en localStorage
        this.token = null;
        delete localStorage['token'];
        delete localStorage['sector'];
        this.user = null;
    };
    // Méthode appelée pour savoir si l'utilisateur est connectée.
    AuthenticationService.prototype.authenticated = function () {
        // tokenNotExpired permet de savoir si le token est valide
        return angular2_jwt_1.tokenNotExpired();
    };
    // Méthode permettant de savoir si l'utilisateur a un secteur en cours
    AuthenticationService.prototype.has_a_sector = function () {
        return localStorage["sector"] != '0';
    };
    AuthenticationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, angular2_toaster_1.ToasterService])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map