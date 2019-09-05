import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
import { PhoneValidator } from '../validators/phone.validator';
import { PasswordValidator } from '../validators/password.validator';
import { CountryPhone } from './country-phone.model';
import { OrderPipe } from 'ngx-order-pipe';
var RegisterPage = /** @class */ (function () {
    function RegisterPage(http, modalController, authService, navCtrl, alertService, storage, loading, env, formBuilder, orderPipe) {
        this.http = http;
        this.modalController = modalController;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
        this.storage = storage;
        this.loading = loading;
        this.env = env;
        this.formBuilder = formBuilder;
        this.orderPipe = orderPipe;
        this.provinces = [];
        this.cities = [];
        this.barangays = [];
        this.eightenyearsAgo = '';
        this.validation_messages = {
            // 'username': [
            //   { type: 'required', message: 'Username is required.' },
            //   { type: 'minlength', message: 'Username must be at least 5 characters long.' },
            //   { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
            //   { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
            //   { type: 'validUsername', message: 'Your username has already been taken.' }
            // ],
            'first_name': [
                { type: 'required', message: 'First name is required.' },
                { type: 'pattern', message: 'Your firstname must contain only letters.' }
            ],
            'last_name': [
                { type: 'required', message: 'Last name is required.' },
                { type: 'pattern', message: 'Your lastname must contain only letters.' }
            ],
            'birthday': [
                { type: 'required', message: 'Birthday is required.' }
            ],
            'birthyear': [
                { type: 'required', message: 'Year is required.' }
            ],
            'birthmonth': [
                { type: 'required', message: 'Month is required.' }
            ],
            'email': [
                { type: 'required', message: 'Email is required.' },
                { type: 'pattern', message: 'Please enter a valid email.' }
            ],
            'phone': [
                { type: 'required', message: 'Phone is required.' },
                { type: 'validCountryPhone', message: 'The phone is incorrect.' }
            ],
            'street': [
                { type: 'required', message: 'Street is required.' }
            ],
            'city': [
                { type: 'required', message: 'City is required.' }
            ],
            'province': [
                { type: 'required', message: 'Province is required.' }
            ],
            'country': [
                { type: 'required', message: 'Country is required.' }
            ],
            'zip': [
                { type: 'required', message: 'Zip is required.' },
                { type: 'minlength', message: 'Zip must be at least 4 characters long.' },
                { type: 'maxlength', message: 'Zip cannot be more than 4 characters long.' },
                { type: 'pattern', message: 'Your zip must contain only numbers.' }
            ],
            'password': [
                { type: 'required', message: 'Password is required.' },
                { type: 'minlength', message: 'Password must be at least 5 characters long.' },
                { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
            ],
            'confirm_password': [
                { type: 'required', message: 'Confirm password is required.' }
            ],
            'matching_passwords': [
                { type: 'areEqual', message: 'Password mismatch.' }
            ],
            'terms': [
                { type: 'pattern', message: 'You must accept terms and conditions.' }
            ],
        };
    }
    RegisterPage.prototype.tapProvince = function (event) {
        var _this = this;
        // console.log(event.detail.value);
        var province = event.detail.value;
        fetch('./assets/json/refcitymun.json').then(function (res) { return res.json(); })
            .then(function (json) {
            // console.log(json.RECORDS);
            var records = json.RECORDS;
            _this.cities = records.filter(function (item) { return item.provCode === province.provCode; });
            _this.cities = _this.orderPipe.transform(_this.cities, 'provDesc');
            // console.log(this.cities);
        });
    };
    ;
    RegisterPage.prototype.tapCity = function (event) {
        var _this = this;
        // console.log(event.detail.value);
        var city = event.detail.value;
        fetch('./assets/json/refbrgy.json').then(function (res) { return res.json(); })
            .then(function (json) {
            // console.log(json.RECORDS);
            var records = json.RECORDS;
            _this.barangays = records.filter(function (item) { return item.citymunCode === city.citymunCode; });
            _this.barangays = _this.orderPipe.transform(_this.barangays, 'provDesc');
            console.log(_this.barangays);
        });
    };
    ;
    RegisterPage.prototype.tapBarangay = function (event) {
        console.log(event.detail.value);
    };
    ;
    RegisterPage.prototype.ngOnInit = function () {
        var _this = this;
        fetch('./assets/json/refprovince.json').then(function (res) { return res.json(); })
            .then(function (json) {
            // console.log(json.RECORDS);
            _this.provinces = _this.orderPipe.transform(json.RECORDS, 'provDesc');
        });
        this.countries = [
            new CountryPhone('PH', 'PHILIPPINES')
        ];
        this.genders = [
            "Male",
            "Female"
        ];
        this.matching_passwords_group = new FormGroup({
            password: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required,
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
            ])),
            confirm_password: new FormControl('', Validators.required)
        }, function (formGroup) {
            return PasswordValidator.areEqual(formGroup);
        });
        var country = new FormControl(this.countries[0], Validators.required);
        var phone = new FormControl('', Validators.compose([
            Validators.required,
            PhoneValidator.validCountryPhone(country)
        ]));
        this.country_phone_group = new FormGroup({
            country: country,
            phone: phone
        });
        this.validations_form = this.formBuilder.group({
            // username: new FormControl('', Validators.compose([
            //   UsernameValidator.validUsername,
            //   Validators.maxLength(25),
            //   Validators.minLength(5),
            //   Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
            //   Validators.required
            // ])),
            // first_name: new FormControl('', Validators.required),
            first_name: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('[a-zA-Z]+')
            ])),
            middle_name: new FormControl(''),
            last_name: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('[a-zA-Z]+')
            ])),
            birthday: new FormControl('', Validators.required),
            birthyear: new FormControl('', Validators.required),
            birthmonth: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
            country_phone: this.country_phone_group,
            street: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            province: new FormControl('', Validators.required),
            country: new FormControl('PHILIPPINES', Validators.required),
            zip: new FormControl('', Validators.compose([
                Validators.required,
                Validators.maxLength(4),
                Validators.minLength(4),
                Validators.pattern('[0-9]+')
            ])),
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            matching_passwords: this.matching_passwords_group,
            terms: new FormControl(true, Validators.pattern('true'))
        });
    };
    RegisterPage.prototype.onSubmit = function (values) {
        var _this = this;
        this.loading.present();
        if (this.validations_form.valid) {
            // console.log(values);
            this.authService.register(values.first_name, values.middle_name, values.last_name, values.street, values.city, values.province, values.country, values.zip, values.birthmonth, values.birthday, values.birthyear, values.gender, values.country_phone.phone, values.email, values.matching_passwords.password, values.matching_passwords.confirm_password).subscribe(function (data) {
                _this.loading.dismiss();
                _this.alertService.presentToast('You are now registered! Check your email to activate account.');
                _this.navCtrl.navigateRoot('/login');
                console.log(data);
            }, function (error) {
                _this.loading.dismiss();
                _this.alertService.presentToast('Email already exist.');
                console.log(error);
            }, function () {
            });
        }
        else {
            var message = 'Input all required fields. ';
            for (var key in this.validation_messages) {
                var validations = this.validation_messages[key];
                for (var index in validations) {
                    var validation = validations[index];
                    if (this.validations_form.get(key) != null) {
                        if (this.validations_form.get(key).hasError(validation.type)) {
                            message += validation.message + ' ';
                        }
                    }
                    else {
                        message += validation.message + ' ';
                    }
                }
            }
            this.loading.dismiss();
            this.alertService.presentToast(message);
        }
    };
    RegisterPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.http.post(this.env.HERO_API + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        this.http.post(this.env.API_URL + 'check/server', {}).subscribe(function (data) { }, function (error) { _this.alertService.presentToast("Server not found. Check your internet connection."); });
        var eightenyearsAgo = function (sp) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //As January is 0.
            var yyyy = today.getFullYear() - 18;
            if (dd < 10)
                dd = '0' + dd;
            if (mm < 10)
                mm = '0' + mm;
            return (yyyy + sp + mm + sp + dd);
        };
        this.eightenyearsAgo = eightenyearsAgo('-');
        this.authService.getToken().then(function () {
            if (_this.authService.isLoggedIn) {
                _this.navCtrl.navigateRoot('/tabs/home');
            }
        });
    };
    RegisterPage = tslib_1.__decorate([
        Component({
            selector: 'app-register',
            templateUrl: './register.page.html',
            styleUrls: ['./register.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            ModalController,
            AuthService,
            NavController,
            AlertService,
            Storage,
            LoadingService,
            EnvService,
            FormBuilder,
            OrderPipe])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.page.js.map