import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { JobService } from 'src/app/services/job.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
var HelpPage = /** @class */ (function () {
    function HelpPage(http, menu, authService, navCtrl, storage, alertService, loading, getService, jobService, router, env) {
        this.http = http;
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.loading = loading;
        this.getService = getService;
        this.jobService = jobService;
        this.router = router;
        this.env = env;
        this.user = {
            email: '',
            password: '',
            status: ''
        };
        this.profile = {
            first_name: '',
            middle_name: '',
            last_name: '',
            birthday: '',
            gender: '',
            photo: ''
        };
        this.photo = '';
        this.menu.enable(true);
    }
    HelpPage.prototype.ngOnInit = function () {
    };
    HelpPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    HelpPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
        this.http.post(this.env.HERO_API + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.http.post(this.env.API_URL + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.storage.get('hero').then(function (val) {
            _this.user = val.data;
            _this.profile = val.data.profile;
            if (_this.profile.photo !== null) {
                _this.photo = _this.env.IMAGE_URL + 'uploads/' + _this.profile.photo;
            }
            else {
                _this.photo = _this.env.DEFAULT_IMG;
            }
            _this.authService.validateApp(_this.user.email, _this.user.password);
            _this.loading.dismiss();
        });
    };
    HelpPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    HelpPage = tslib_1.__decorate([
        Component({
            selector: 'app-help',
            templateUrl: './help.page.html',
            styleUrls: ['./help.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            LoadingService,
            GetService,
            JobService,
            Router,
            EnvService])
    ], HelpPage);
    return HelpPage;
}());
export { HelpPage };
//# sourceMappingURL=help.page.js.map