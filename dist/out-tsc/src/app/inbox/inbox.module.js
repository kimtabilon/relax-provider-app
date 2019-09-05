import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InboxPage } from './inbox.page';
var routes = [
    {
        path: '',
        component: InboxPage
    }
];
var InboxPageModule = /** @class */ (function () {
    function InboxPageModule() {
    }
    InboxPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [InboxPage]
        })
    ], InboxPageModule);
    return InboxPageModule;
}());
export { InboxPageModule };
//# sourceMappingURL=inbox.module.js.map