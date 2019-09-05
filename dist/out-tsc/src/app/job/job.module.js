import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { JobPage } from './job.page';
var routes = [
    {
        path: '',
        component: JobPage
    }
];
var JobPageModule = /** @class */ (function () {
    function JobPageModule() {
    }
    JobPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [JobPage]
        })
    ], JobPageModule);
    return JobPageModule;
}());
export { JobPageModule };
//# sourceMappingURL=job.module.js.map