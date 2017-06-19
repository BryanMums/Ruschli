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
var ChooseSectorComponent = (function () {
    function ChooseSectorComponent(userService, router) {
        this.userService = userService;
        this.router = router;
        this.selectedSector = 0;
    }
    ChooseSectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getConnectedUser()
            .subscribe(function (user) {
            _this.user = user;
        });
    };
    ChooseSectorComponent.prototype.change = function (pk) {
        localStorage["sector"] = pk;
        this.router.navigate(['/']);
    };
    return ChooseSectorComponent;
}());
ChooseSectorComponent = __decorate([
    core_1.Component({
        selector: 'choose-sector',
        moduleId: module.id,
        templateUrl: 'choose_sector.component.html'
    }),
    __metadata("design:paramtypes", [index_1.UserService, router_1.Router])
], ChooseSectorComponent);
exports.ChooseSectorComponent = ChooseSectorComponent;
//# sourceMappingURL=choose_sector.component.js.map