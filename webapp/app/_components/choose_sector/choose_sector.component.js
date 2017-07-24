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
var router_1 = require("@angular/router");
require("rxjs/add/operator/switchMap");
var index_1 = require("../../_services/index");
var angular2_toaster_1 = require("angular2-toaster");
var ChooseSectorComponent = (function () {
    function ChooseSectorComponent(userService, router, toasterService) {
        this.userService = userService;
        this.router = router;
        this.toasterService = toasterService;
        this.selectedSector = 1; // L'ID du secteur où travaille l'utilisateur
    }
    ChooseSectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        // On récupère les informations de l'utilisateur connecté
        this.userService.getConnectedUser()
            .subscribe(function (user) {
            _this.user = user;
        });
        // On récupère l'ID du secteur dans lequel il travaille
        this.selectedSector = parseInt(localStorage["sector"]);
    };
    // Méthode appelée lors du changement de secteur
    ChooseSectorComponent.prototype.change = function (pk) {
        // On stock l'ID du nouveau secteur en local storage
        localStorage["sector"] = pk;
        // On affiche un message
        this.toasterService.pop('success', 'Choix de secteur', 'Vous avez choisi un secteur !');
    };
    ChooseSectorComponent = __decorate([
        core_1.Component({
            selector: 'choose-sector',
            moduleId: module.id,
            templateUrl: 'choose_sector.component.html'
        }),
        __metadata("design:paramtypes", [index_1.UserService,
            router_1.Router,
            angular2_toaster_1.ToasterService])
    ], ChooseSectorComponent);
    return ChooseSectorComponent;
}());
exports.ChooseSectorComponent = ChooseSectorComponent;
//# sourceMappingURL=choose_sector.component.js.map