import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController, AlertController, ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { JobService } from 'src/app/services/job.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
var InboxPage = /** @class */ (function () {
    function InboxPage(http, menu, authService, navCtrl, storage, alertService, loading, getService, jobService, router, env, alertCtrl, actionSheetController) {
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
        this.alertCtrl = alertCtrl;
        this.actionSheetController = actionSheetController;
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
        this.notifications = [];
        this.title = 'Please wait...';
        this.menu.enable(true);
    }
    InboxPage.prototype.ngOnInit = function () {
    };
    InboxPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    InboxPage.prototype.ionViewWillEnter = function () {
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
            /*Get My Jobs*/
            _this.http.post(_this.env.HERO_API + 'inboxes/byUser', { app_key: _this.env.APP_ID, user_id: _this.user.id })
                .subscribe(function (data) {
                var response = data;
                _this.notifications = response.data;
                // console.log(this.notifications);
                _this.title = 'My Inbox';
                _this.loading.dismiss();
            }, function (error) {
                console.log(error);
                _this.title = 'My Inbox';
                _this.loading.dismiss();
            });
        });
    };
    InboxPage.prototype.presentActionSheet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            header: 'Actions',
                            buttons: [{
                                    text: 'Hide Notification',
                                    role: 'destructive',
                                    icon: 'trash',
                                    handler: function () {
                                        console.log('Delete clicked');
                                    }
                                }, {
                                    text: 'Share',
                                    icon: 'share',
                                    handler: function () {
                                        console.log('Share clicked');
                                    }
                                }, {
                                    text: 'Play (open modal)',
                                    icon: 'arrow-dropright-circle',
                                    handler: function () {
                                        console.log('Play clicked');
                                    }
                                }, {
                                    text: 'Favorite',
                                    icon: 'heart',
                                    handler: function () {
                                        console.log('Favorite clicked');
                                    }
                                }, {
                                    text: 'Cancel',
                                    icon: 'close',
                                    role: 'cancel',
                                    handler: function () {
                                        console.log('Cancel clicked');
                                    }
                                }]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InboxPage.prototype.tapNoti = function (noti) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, alert_1;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.loading.present();
                        _a = noti.type;
                        switch (_a) {
                            case "Available Job": return [3 /*break*/, 1];
                            case "For Confirmation": return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 3];
                    case 1:
                        this.router.navigate(['/tabs/quotation'], {
                            queryParams: {
                                job_id: noti.redirect_id,
                                noti_id: noti.id
                            },
                        });
                        this.loading.dismiss();
                        return [3 /*break*/, 6];
                    case 2:
                        this.router.navigate(['/tabs/jobview'], {
                            queryParams: {
                                job_id: noti.redirect_id,
                                noti_id: noti.id
                            },
                        });
                        this.loading.dismiss();
                        return [3 /*break*/, 6];
                    case 3:
                        this.loading.dismiss();
                        return [4 /*yield*/, this.alertCtrl.create({
                                header: '',
                                message: 'Remove Notification',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function (blah) {
                                        }
                                    }, {
                                        text: 'Remove',
                                        handler: function () {
                                            _this.loading.present();
                                            _this.http.post(_this.env.HERO_API + 'inboxes/hide', { id: noti.id })
                                                .subscribe(function (data) {
                                                var response = data;
                                                noti.seen = 'Yes';
                                                _this.loading.dismiss();
                                            }, function (error) { _this.loading.dismiss(); });
                                        }
                                    }
                                ]
                            })];
                    case 4:
                        alert_1 = _b.sent();
                        return [4 /*yield*/, alert_1.present()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    InboxPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    InboxPage = tslib_1.__decorate([
        Component({
            selector: 'app-inbox',
            templateUrl: './inbox.page.html',
            styleUrls: ['./inbox.page.scss'],
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
            EnvService,
            AlertController,
            ActionSheetController])
    ], InboxPage);
    return InboxPage;
}());
export { InboxPage };
//# sourceMappingURL=inbox.page.js.map