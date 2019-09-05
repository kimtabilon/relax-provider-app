import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { QuotationPage } from './quotation.page';
var routes = [
    {
        path: '',
        component: QuotationPage
    }
];
var QuotationPageModule = /** @class */ (function () {
    function QuotationPageModule() {
    }
    QuotationPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [QuotationPage]
        })
    ], QuotationPageModule);
    return QuotationPageModule;
}());
export { QuotationPageModule };
//# sourceMappingURL=quotation.module.js.map