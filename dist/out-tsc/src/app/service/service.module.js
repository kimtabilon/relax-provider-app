import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicePage } from './service.page';
var routes = [
    {
        path: '',
        component: ServicePage
    }
];
var ServicePageModule = /** @class */ (function () {
    function ServicePageModule() {
    }
    ServicePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ServicePage]
        })
    ], ServicePageModule);
    return ServicePageModule;
}());
export { ServicePageModule };
//# sourceMappingURL=service.module.js.map