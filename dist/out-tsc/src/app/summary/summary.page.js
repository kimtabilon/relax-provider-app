import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
var SummaryPage = /** @class */ (function () {
    function SummaryPage(menu, authService, navCtrl, storage, alertService) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
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
        this.photo = 'https://www.fakepersongenerator.com/Face/male/male1085206437439.jpg';
        this.menu.enable(true);
    }
    SummaryPage.prototype.ngOnInit = function () {
    };
    SummaryPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.storage.get('hero').then(function (val) {
            _this.user = val.data;
            _this.profile = val.data.profile;
        });
    };
    SummaryPage.prototype.logout = function () {
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
    };
    SummaryPage = tslib_1.__decorate([
        Component({
            selector: 'app-summary',
            templateUrl: './summary.page.html',
            styleUrls: ['./summary.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService])
    ], SummaryPage);
    return SummaryPage;
}());
export { SummaryPage };
//# sourceMappingURL=summary.page.js.map