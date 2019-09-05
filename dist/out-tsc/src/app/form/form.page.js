import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
var FormPage = /** @class */ (function () {
    function FormPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, loading, http, env) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.loading = loading;
        this.http = http;
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
        this.serviceExist = false;
        this.pay_type = '';
        this.heroService = {
            id: '',
            hero_id: '',
            service_id: '',
            pay_per: '',
            status: '0'
        };
        this.menu.enable(true);
    }
    FormPage.prototype.ngOnInit = function () {
    };
    FormPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    FormPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
        this.storage.get('hero').then(function (val) {
            _this.user = val.data;
            _this.profile = val.data.profile;
            if (_this.profile.photo !== null) {
                _this.photo = _this.env.IMAGE_URL + 'uploads/' + _this.profile.photo;
            }
            else {
                _this.photo = _this.env.DEFAULT_IMG;
            }
            _this.heroService.hero_id = _this.user.id;
        });
        this.activatedRoute.queryParams.subscribe(function (res) {
            _this.service = JSON.parse(res.service);
            _this.heroService.service_id = _this.service.id;
            _this.pay_type = _this.service.pay_type;
            _this.title = _this.service.name;
            if (_this.service.pivot) {
                _this.heroService.pay_per = _this.service.pivot.pay_per;
                _this.heroService.id = _this.service.pivot.id;
                _this.serviceExist = true;
            }
            else {
                _this.heroService.id = '';
                _this.heroService.pay_per = '';
                _this.serviceExist = false;
            }
        });
        this.loading.dismiss();
    };
    FormPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/home'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    FormPage.prototype.tapNext = function () {
        var _this = this;
        this.loading.present();
        /*Save Hero Service*/
        this.http.post(this.env.HERO_API + 'hero_services/save', this.heroService)
            .subscribe(function (data) {
            _this.heroService.pay_per = '';
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () { _this.navCtrl.navigateRoot('/tabs/home'); });
        this.loading.dismiss();
    };
    FormPage.prototype.tapRemove = function () {
        var _this = this;
        this.loading.present();
        // console.log(this.heroService);
        /*Save Hero Service*/
        this.http.post(this.env.HERO_API + 'hero_services/delete', this.heroService)
            .subscribe(function (data) {
            _this.heroService.pay_per = '';
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () { _this.navCtrl.navigateRoot('/tabs/home'); });
        this.loading.dismiss();
    };
    FormPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    FormPage = tslib_1.__decorate([
        Component({
            selector: 'app-form',
            templateUrl: './form.page.html',
            styleUrls: ['./form.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            Router,
            ActivatedRoute,
            LoadingService,
            HttpClient,
            EnvService])
    ], FormPage);
    return FormPage;
}());
export { FormPage };
//# sourceMappingURL=form.page.js.map