import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
var HeroPage = /** @class */ (function () {
    function HeroPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, http, env) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.router = router;
        this.activatedRoute = activatedRoute;
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
        this.menu.enable(true);
    }
    HeroPage.prototype.ngOnInit = function () {
    };
    HeroPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    HeroPage.prototype.ionViewWillEnter = function () {
        var _this = this;
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
            _this.title = res.title;
            _this.heroes = JSON.parse(res.heroes);
            _this.job_id = JSON.parse(res.job_id);
        });
    };
    HeroPage.prototype.tapHero = function (hero) {
        var _this = this;
        this.http.post(this.env.HERO_API + 'jobs/modify', { job_id: this.job_id, hero_id: hero.id }).subscribe(function (data) {
            // this.job = data;
        }, function (error) {
            _this.alertService.presentToast("Save failed!");
        }, function () {
            _this.alertService.presentToast("Please wait for confirmation!");
            _this.router.navigate(['/tabs/home'], {
                queryParams: {},
            });
        });
    };
    HeroPage.prototype.tapBack = function () {
        this.router.navigate(['/tabs/home'], {
            queryParams: {},
        });
    };
    HeroPage.prototype.logout = function () {
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
    };
    HeroPage = tslib_1.__decorate([
        Component({
            selector: 'app-hero',
            templateUrl: './hero.page.html',
            styleUrls: ['./hero.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            Router,
            ActivatedRoute,
            HttpClient,
            EnvService])
    ], HeroPage);
    return HeroPage;
}());
export { HeroPage };
//# sourceMappingURL=hero.page.js.map