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
var JobPage = /** @class */ (function () {
    function JobPage(http, menu, authService, navCtrl, storage, alertService, loading, getService, jobService, router, env) {
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
        this.app = [];
        this.jobs = [];
        this.jobpage = true;
        this.myjobstitle = 'Please wait..';
        this.completedtitle = 'Completed';
        this.menu.enable(true);
    }
    JobPage.prototype.ngOnInit = function () {
    };
    JobPage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    JobPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
        this.jobpage = true;
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
            _this.http.post(_this.env.HERO_API + 'hero/jobs', { id: _this.user.id })
                .subscribe(function (data) {
                var response = data;
                if (response !== null) {
                    _this.jobs = response.data;
                }
                else {
                    _this.jobs = [];
                }
                _this.myjobstitle = 'My Jobs';
                _this.loading.dismiss();
            }, function (error) {
                _this.myjobstitle = 'My Jobs';
                _this.loading.dismiss();
            });
            _this.storage.get('app').then(function (val) {
                _this.app = val.data;
            });
        });
    };
    JobPage.prototype.tapJob = function (job) {
        this.loading.present();
        switch (job.status) {
            case "For Quotation":
                this.router.navigate(['/tabs/quotation'], {
                    queryParams: {
                        job_id: job.id
                    },
                });
                break;
            default:
                this.router.navigate(['/tabs/jobview'], {
                    queryParams: {
                        job_id: job.id
                    },
                });
                break;
        }
        this.loading.dismiss();
    };
    JobPage.prototype.tapCompleted = function () {
        var _this = this;
        this.loading.present();
        this.jobpage = false;
        this.completedtitle = 'Please wait...';
        /*Get My Jobs*/
        this.http.post(this.env.HERO_API + 'jobs/completed', { id: this.user.id })
            .subscribe(function (data) {
            var response = data;
            if (response !== null) {
                _this.jobs = response.data;
            }
            else {
                _this.jobs = [];
            }
            _this.completedtitle = 'Completed';
        }, function (error) { _this.completedtitle = 'Completed'; });
        this.loading.dismiss();
    };
    JobPage.prototype.tapMyJobs = function () {
        var _this = this;
        this.loading.present();
        this.jobpage = true;
        this.myjobstitle = 'Please wait...';
        /*Get My Jobs*/
        this.http.post(this.env.HERO_API + 'hero/jobs', { id: this.user.id })
            .subscribe(function (data) {
            var response = data;
            if (response !== null) {
                _this.jobs = response.data;
            }
            else {
                _this.jobs = [];
            }
            _this.myjobstitle = 'My Jobs';
        }, function (error) { _this.myjobstitle = 'My Jobs'; });
        this.loading.dismiss();
    };
    JobPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    JobPage = tslib_1.__decorate([
        Component({
            selector: 'app-job',
            templateUrl: './job.page.html',
            styleUrls: ['./job.page.scss'],
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
    ], JobPage);
    return JobPage;
}());
export { JobPage };
//# sourceMappingURL=job.page.js.map