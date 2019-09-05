import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
var LoginresetPage = /** @class */ (function () {
    function LoginresetPage(http, modalController, authService, navCtrl, alertService, storage, getService, loading, env) {
        this.http = http;
        this.modalController = modalController;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
        this.storage = storage;
        this.getService = getService;
        this.loading = loading;
        this.env = env;
    }
    LoginresetPage.prototype.ngOnInit = function () {
    };
    LoginresetPage.prototype.reset = function (form) {
        var _this = this;
        this.loading.present();
        if (form.value.name != '' && form.value.email != '') {
            console.log(form.value);
            this.http.post(this.env.HERO_API + 'hero/mail/resetpassword', { name: form.value.name, email: form.value.email })
                .subscribe(function (data) {
                var response = data;
                console.log(response);
                _this.loading.dismiss();
                _this.alertService.presentToast("Check your email for new password");
            }, function (error) {
                _this.loading.dismiss();
                _this.alertService.presentToast("Account not found.");
                console.log(error);
            });
        }
        else {
            this.loading.dismiss();
            this.alertService.presentToast("Required name and email");
        }
    };
    LoginresetPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.http.post(this.env.HERO_API + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.http.post(this.env.API_URL + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.authService.getToken().then(function () {
            if (_this.authService.isLoggedIn) {
                _this.navCtrl.navigateRoot('/tabs/home');
            }
        });
    };
    LoginresetPage = tslib_1.__decorate([
        Component({
            selector: 'app-loginreset',
            templateUrl: './loginreset.page.html',
            styleUrls: ['./loginreset.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            ModalController,
            AuthService,
            NavController,
            AlertService,
            Storage,
            GetService,
            LoadingService,
            EnvService])
    ], LoginresetPage);
    return LoginresetPage;
}());
export { LoginresetPage };
//# sourceMappingURL=loginreset.page.js.map