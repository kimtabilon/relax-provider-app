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
var QuotationPage = /** @class */ (function () {
    function QuotationPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, loading, http, env) {
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
        this.job = [];
        this.attributes = [];
        this.form = [];
        this.formExist = false;
        this.status = '';
        this.customer_info = [];
        this.quote = {
            hero_id: '',
            job_id: '',
            amount: '0',
            noti_id: '0'
        };
        this.menu.enable(true);
    }
    QuotationPage.prototype.ngOnInit = function () {
    };
    QuotationPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    QuotationPage.prototype.ionViewWillEnter = function () {
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
            _this.quote.hero_id = _this.user.id;
        });
        this.activatedRoute.queryParams.subscribe(function (res) {
            var job_id = res.job_id;
            _this.quote.noti_id = res.noti_id;
            _this.http.post(_this.env.HERO_API + 'jobs/byID', { id: job_id })
                .subscribe(function (data) {
                var response = data;
                _this.job = response.data;
                _this.attributes = JSON.parse(_this.job.form_value);
                _this.customer_info = JSON.parse(_this.job.customer_info);
                _this.quote.job_id = _this.job.id;
                _this.status = _this.job.status;
                if (_this.job.form !== null) {
                    _this.form = _this.job.form;
                    _this.formExist = true;
                }
                else {
                    _this.formExist = false;
                }
                if (_this.quote.noti_id == undefined) {
                    _this.quote.noti_id = _this.job.noti_id;
                }
                _this.loading.dismiss();
            }, function (error) {
                _this.alertService.presentToast("Client removed this job.");
                _this.tapDeny();
                console.log(error);
                _this.loading.dismiss();
            });
        });
    };
    QuotationPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/inbox'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    QuotationPage.prototype.tapNext = function () {
        var _this = this;
        this.loading.present();
        console.log(this.quote);
        if (this.quote.amount > 0) {
            this.http.post(this.env.HERO_API + 'quotations/store', this.quote)
                .subscribe(function (data) {
            }, function (error) {
                _this.loading.dismiss();
                // this.alertService.presentToast("Server not responding!"); 
                _this.alertService.presentToast("Client removed this job.");
                _this.tapDeny();
                console.log(error);
            }, function () {
                _this.loading.dismiss();
                _this.navCtrl.navigateRoot('/tabs/inbox');
            });
        }
        else {
            this.loading.dismiss();
            this.alertService.presentToast("Input Quote Amount");
        }
    };
    QuotationPage.prototype.tapDeny = function () {
        var _this = this;
        this.loading.present();
        this.http.post(this.env.HERO_API + 'inboxes/hide', { id: this.quote.noti_id })
            .subscribe(function (data) {
            var response = data;
            _this.loading.dismiss();
        }, function (error) {
            _this.loading.dismiss();
            console.log(error);
        }, function () {
            _this.loading.dismiss();
            _this.navCtrl.navigateRoot('/tabs/inbox');
        });
    };
    QuotationPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    QuotationPage = tslib_1.__decorate([
        Component({
            selector: 'app-quotation',
            templateUrl: './quotation.page.html',
            styleUrls: ['./quotation.page.scss'],
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
    ], QuotationPage);
    return QuotationPage;
}());
export { QuotationPage };
//# sourceMappingURL=quotation.page.js.map