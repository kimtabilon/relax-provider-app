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
var CategoryPage = /** @class */ (function () {
    function CategoryPage(http, menu, authService, navCtrl, storage, alertService, loading, getService, jobService, router, env) {
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
        this.categories = [];
        this.app = [];
        this.title = 'Please wait...';
        this.menu.enable(true);
    }
    CategoryPage.prototype.ngOnInit = function () {
    };
    CategoryPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    CategoryPage.prototype.ionViewWillEnter = function () {
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
            _this.authService.validateApp(_this.user.email, _this.user.password);
        });
        this.storage.get('app').then(function (val) {
            _this.app = val.data;
        });
        /*Get All Services*/
        this.http.post(this.env.HERO_API + 'categories/onlyservice', { key: this.env.APP_ID })
            .subscribe(function (data) {
            var response = data;
            _this.categories = response.data;
            _this.title = 'Add Service';
            _this.loading.dismiss();
        }, function (error) {
            console.log(error);
            _this.loading.dismiss();
            _this.title = 'Add Service';
        });
    };
    CategoryPage.prototype.tapCategory = function (category) {
        this.loading.present();
        if (category.services.length) {
            this.router.navigate(['/tabs/service'], {
                queryParams: {
                    value: JSON.stringify(category)
                },
            });
        }
        else {
            this.alertService.presentToast("No Service Available");
        }
        this.loading.dismiss();
    };
    CategoryPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/home'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    CategoryPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    CategoryPage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: './category.page.html',
            styleUrls: ['./category.page.scss'],
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
    ], CategoryPage);
    return CategoryPage;
}());
export { CategoryPage };
//# sourceMappingURL=category.page.js.map