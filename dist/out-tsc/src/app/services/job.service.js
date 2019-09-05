import * as tslib_1 from "tslib";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
var JobService = /** @class */ (function () {
    function JobService(http, storage, env, navCtrl, alertService) {
        this.http = http;
        this.storage = storage;
        this.env = env;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
    }
    JobService.prototype.myJobs = function (id, app_id) {
        var _this = this;
        this.http.post(this.env.HERO_API + 'job/myjobs', { id: id, app: app_id }).subscribe(function (data) {
            console.log(data);
            _this.storage.set('myjobs', data);
        }, function (error) {
        }, function () {
            // this.navCtrl.navigateRoot('/tabs/service');
        });
    };
    JobService.prototype.myQuotation = function (id, app_id) {
        var _this = this;
        this.http.post(this.env.HERO_API + 'job/myquotes', { id: id, app: app_id }).subscribe(function (data) {
            console.log(data);
            _this.storage.set('myquotes', data);
        }, function (error) {
        }, function () {
            // this.navCtrl.navigateRoot('/tabs/service');
        });
    };
    JobService.prototype.forQuotation = function (app_id) {
        var _this = this;
        this.http.post(this.env.HERO_API + 'job/forquote', { app: app_id }).subscribe(function (data) {
            console.log(data);
            _this.storage.set('forquotation', data);
        }, function (error) {
        }, function () {
            // this.navCtrl.navigateRoot('/tabs/service');
        });
    };
    JobService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage,
            EnvService,
            NavController,
            AlertService])
    ], JobService);
    return JobService;
}());
export { JobService };
//# sourceMappingURL=job.service.js.map