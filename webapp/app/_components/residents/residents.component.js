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
var index_1 = require("../../_services/index");
var ResidentsComponent = (function () {
    function ResidentsComponent(residentService, router) {
        this.residentService = residentService;
        this.router = router;
        this.residents = [];
        this.tabSort = [];
        this.selectedSort = 0;
        this.tabSort[0] = ['Prénom (croissant)', 'firstname', 1];
        this.tabSort[1] = ['Prénom (décroissant)', 'firstname', -1];
        this.tabSort[2] = ['Nom (croissant)', 'lastname', 1];
        this.tabSort[3] = ['Nom (décroissant)', 'lastname', -1];
    }
    ResidentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get residents from secure api end point
        this.residentService.getResidents()
            .subscribe(function (residents) {
            _this.residents = residents;
            _this.onSort(_this.selectedSort);
        });
    };
    ResidentsComponent.prototype.onSelect = function (resident) {
        this.router.navigate(['/resident', resident.pk]);
    };
    ResidentsComponent.prototype.onSort = function (index) {
        var param = this.tabSort[index][1];
        var value = this.tabSort[index][2];
        this.residents.sort(function (res1, res2) {
            if (res1[param] > res2[param]) {
                return -1 * parseInt(value);
            }
            else if (res1[param] < res2[param]) {
                return 1 * parseInt(value);
            }
            else {
                return 0;
            }
        });
        console.log(this.residents);
    };
    ResidentsComponent.prototype.test = function (lol) {
        console.log(lol);
    };
    return ResidentsComponent;
}());
ResidentsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'residents.component.html',
    }),
    __metadata("design:paramtypes", [index_1.ResidentService, router_1.Router])
], ResidentsComponent);
exports.ResidentsComponent = ResidentsComponent;
//# sourceMappingURL=residents.component.js.map