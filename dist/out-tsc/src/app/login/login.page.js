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
var LoginPage = /** @class */ (function () {
    function LoginPage(http, modalController, authService, navCtrl, alertService, storage, getService, loading, env) {
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
    LoginPage.prototype.ngOnInit = function () {
    };
    LoginPage.prototype.login = function (form) {
        var _this = this;
        this.loading.present();
        if (form.value.email != '' && form.value.password != '') {
            this.authService.login(form.value.email, form.value.password).subscribe(function (data) {
                // console.log(data);
                _this.loading.dismiss();
                _this.storage.set('hero', data);
                // this.alertService.presentToast("Logged In");
            }, function (error) {
                _this.loading.dismiss();
                _this.alertService.presentToast("Wrong Email/Password or Inactive account");
                // this.alertService.presentToast(error.message);
            }, function () {
                _this.navCtrl.navigateRoot('/tabs/home');
            });
        }
        else {
            this.loading.dismiss();
            this.alertService.presentToast("Empty Email or Password");
        }
    };
    LoginPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.http.post(this.env.HERO_API + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.http.post(this.env.API_URL + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.authService.getToken().then(function () {
            if (_this.authService.isLoggedIn) {
                _this.navCtrl.navigateRoot('/tabs/home');
            }
        });
    };
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
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
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map