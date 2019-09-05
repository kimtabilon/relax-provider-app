import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/services/env.service';
var OptionPage = /** @class */ (function () {
    function OptionPage(menu, authService, navCtrl, storage, alertService, loading, router, env, activatedRoute) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.loading = loading;
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
        this.menu.enable(true);
    }
    OptionPage.prototype.ngOnInit = function () {
    };
    OptionPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    OptionPage.prototype.ionViewWillEnter = function () {
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
        this.activatedRoute.queryParams.subscribe(function (res) {
            _this.heroes = JSON.parse(res.service).heroes;
            _this.options = JSON.parse(res.service).options;
            _this.title = JSON.parse(res.service).name;
            _this.services = JSON.parse(res.services);
            _this.backTitle = res.backTitle;
        });
        this.loading.dismiss();
    };
    OptionPage.prototype.tapOption = function (option) {
        this.loading.present();
        // console.log(option.form.length);
        if (option.form !== null) {
            this.router.navigate(['/tabs/form'], {
                queryParams: {
                    option: JSON.stringify(option),
                    heroes: JSON.stringify(this.heroes)
                },
            });
        }
        else {
            // this.alertService.presentToast("No Form Available");
        }
        this.loading.dismiss();
    };
    OptionPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/service'], {
            queryParams: {
                value: JSON.stringify({
                    services: this.services,
                    name: this.backTitle
                })
            },
        });
        this.loading.dismiss();
    };
    OptionPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    OptionPage = tslib_1.__decorate([
        Component({
            selector: 'app-option',
            templateUrl: './option.page.html',
            styleUrls: ['./option.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            LoadingService,
            Router,
            EnvService,
            ActivatedRoute])
    ], OptionPage);
    return OptionPage;
}());
export { OptionPage };
//# sourceMappingURL=option.page.js.map