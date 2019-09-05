import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/services/env.service';
var ServicePage = /** @class */ (function () {
    function ServicePage(menu, authService, navCtrl, storage, alertService, loading, getService, router, env, activatedRoute) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.loading = loading;
        this.getService = getService;
        this.router = router;
        this.env = env;
        this.activatedRoute = activatedRoute;
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
        this.services = [];
        this.title = 'Please wait...';
        this.menu.enable(true);
    }
    ServicePage.prototype.ngOnInit = function () {
    };
    ServicePage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    ServicePage.prototype.ionViewWillEnter = function () {
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
        });
        this.authService.validateApp(this.user.email, this.user.password);
        this.activatedRoute.queryParams.subscribe(function (res) {
            _this.services = JSON.parse(res.value).services;
            _this.title = JSON.parse(res.value).name;
        });
        this.loading.dismiss();
    };
    ServicePage.prototype.tapService = function (service) {
        // console.log(this.services);
        this.loading.present();
        this.router.navigate(['/tabs/form'], {
            queryParams: {
                service: JSON.stringify(service)
            },
        });
        this.loading.dismiss();
    };
    ServicePage.prototype.tapBack = function () {
        // console.log(service);
        this.loading.present();
        this.router.navigate(['/tabs/category'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    ServicePage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    ServicePage = tslib_1.__decorate([
        Component({
            selector: 'app-service',
            templateUrl: './service.page.html',
            styleUrls: ['./service.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            LoadingService,
            GetService,
            Router,
            EnvService,
            ActivatedRoute])
    ], ServicePage);
    return ServicePage;
}());
export { ServicePage };
//# sourceMappingURL=service.page.js.map