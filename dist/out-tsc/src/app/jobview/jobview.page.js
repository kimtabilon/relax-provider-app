import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
var JobviewPage = /** @class */ (function () {
    function JobviewPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, loading, http, env, alertCtrl) {
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
        this.alertCtrl = alertCtrl;
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
        this.status = '';
        this.title = 'Please wait...';
        this.customer_info = [];
        this.formExist = false;
        this.hero = [];
        this.heroExist = false;
        this.noti_id = '';
        this.menu.enable(true);
    }
    JobviewPage.prototype.ngOnInit = function () {
    };
    JobviewPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    JobviewPage.prototype.ionViewWillEnter = function () {
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
            var job_id = res.job_id;
            _this.noti_id = res.noti_id;
            _this.http.post(_this.env.HERO_API + 'jobs/byID', { id: job_id })
                .subscribe(function (data) {
                var response = data;
                _this.job = response.data;
                _this.attributes = JSON.parse(_this.job.form_value);
                _this.customer_info = JSON.parse(_this.job.customer_info);
                _this.status = _this.job.status;
                if (_this.job.form !== null) {
                    _this.form = _this.job.form;
                    _this.formExist = true;
                }
                else {
                    _this.formExist = false;
                }
                if (_this.job.hero !== null) {
                    _this.hero = _this.job.hero;
                    _this.heroExist = true;
                }
                else {
                    _this.heroExist = false;
                }
                if (_this.job.status == 'For Confirmation') {
                    _this.title = 'Confirm Job';
                }
                else {
                    _this.title = 'Job Info';
                }
                if (_this.noti_id == undefined) {
                    _this.noti_id = _this.job.noti_id;
                }
                _this.loading.dismiss();
            }, function (error) {
                _this.title = 'Back';
                _this.alertService.presentToast("Client removed this job.");
                _this.http.post(_this.env.HERO_API + 'inboxes/hide', { id: _this.noti_id })
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
                _this.loading.dismiss();
            });
        });
    };
    JobviewPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/job'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    JobviewPage.prototype.tapConfirm = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: '',
                            message: 'Confirm Job?',
                            buttons: [
                                {
                                    text: 'Back',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                    }
                                }, {
                                    text: 'Confirm',
                                    handler: function () {
                                        _this.loading.present();
                                        /*Confirm Jobs*/
                                        _this.http.post(_this.env.HERO_API + 'jobs/confirm', { id: _this.job.id, noti_id: _this.noti_id })
                                            .subscribe(function (data) {
                                            _this.loading.dismiss();
                                        }, function (error) {
                                            _this.alertService.presentToast("Client removed this job.");
                                            _this.http.post(_this.env.HERO_API + 'inboxes/hide', { id: _this.noti_id })
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
                                            _this.loading.dismiss();
                                            console.log(error);
                                        }, function () { _this.navCtrl.navigateRoot('/tabs/job'); });
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JobviewPage.prototype.tapStartJob = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: '',
                            message: 'Start Job?',
                            buttons: [
                                {
                                    text: 'Back',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                    }
                                }, {
                                    text: 'Continue',
                                    handler: function () {
                                        _this.loading.present();
                                        /*Confirm Jobs*/
                                        _this.http.post(_this.env.HERO_API + 'jobs/start', { id: _this.job.id })
                                            .subscribe(function (data) {
                                            _this.loading.dismiss();
                                        }, function (error) {
                                            _this.alertService.presentToast("Client removed this job.");
                                            // this.http.post(this.env.HERO_API + 'inboxes/hide',{id: this.noti_id})
                                            // .subscribe(data => {
                                            //     let response:any = data;
                                            //     this.loading.dismiss();
                                            // },error => { 
                                            //   this.loading.dismiss(); 
                                            //   console.log(error);
                                            // },() => { 
                                            //   this.loading.dismiss();
                                            //   this.navCtrl.navigateRoot('/tabs/inbox'); 
                                            // });
                                            _this.loading.dismiss();
                                            console.log(error);
                                        }, function () { _this.navCtrl.navigateRoot('/tabs/job'); });
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JobviewPage.prototype.tapDeny = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: '',
                            message: 'Deny Job?',
                            buttons: [
                                {
                                    text: 'Back',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                    }
                                }, {
                                    text: 'Deny',
                                    handler: function () {
                                        _this.loading.present();
                                        /*Confirm Jobs*/
                                        _this.http.post(_this.env.HERO_API + 'jobs/deny', { id: _this.job.id, noti_id: _this.noti_id })
                                            .subscribe(function (data) {
                                            _this.loading.dismiss();
                                        }, function (error) {
                                            console.log(error);
                                            _this.alertService.presentToast("Server not responding!");
                                            _this.loading.dismiss();
                                        }, function () { _this.navCtrl.navigateRoot('/tabs/job'); });
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JobviewPage.prototype.tapDone = function () {
        var _this = this;
        this.loading.present();
        /*Confirm Jobs*/
        this.http.post(this.env.HERO_API + 'jobs/done', { id: this.job.id })
            .subscribe(function (data) {
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () { _this.navCtrl.navigateRoot('/tabs/job'); });
        this.loading.dismiss();
    };
    JobviewPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    JobviewPage = tslib_1.__decorate([
        Component({
            selector: 'app-jobview',
            templateUrl: './jobview.page.html',
            styleUrls: ['./jobview.page.scss'],
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
            EnvService,
            AlertController])
    ], JobviewPage);
    return JobviewPage;
}());
export { JobviewPage };
//# sourceMappingURL=jobview.page.js.map