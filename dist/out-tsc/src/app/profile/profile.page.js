import * as tslib_1 from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
import { MenuController, NavController, ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
var STORAGE_KEY = 'my_images';
var ProfilePage = /** @class */ (function () {
    function ProfilePage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, loading, http, env, camera, file, webview, actionSheetController, toastController, platform, loadingController, ref, filePath) {
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
        this.camera = camera;
        this.file = file;
        this.webview = webview;
        this.actionSheetController = actionSheetController;
        this.toastController = toastController;
        this.platform = platform;
        this.loadingController = loadingController;
        this.ref = ref;
        this.filePath = filePath;
        this.hero = '';
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
        this.address = {
            id: '',
            profile_id: '',
            street: '',
            city: '',
            province: '',
            country: '',
            zip: ''
        };
        this.contact = {
            id: '',
            profile_id: '',
            dial_code: '',
            number: ''
        };
        this.photo = '';
        this.page = 'profile';
        this.images = [];
    }
    ProfilePage.prototype.ngOnInit = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.loadStoredImages();
        });
    };
    ProfilePage.prototype.doRefresh = function (event) {
        this.ionViewWillEnter();
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    ProfilePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
        this.storage.get('hero').then(function (val) {
            _this.hero = val;
            _this.user = val.data;
            _this.profile = val.data.profile;
            _this.http.post(_this.env.HERO_API + 'hero/login', { email: _this.user.email, password: _this.user.password })
                .subscribe(function (data) {
                _this.storage.set('hero', data);
            }, function (error) { console.log(error); });
            if (_this.profile.addresses.length) {
                _this.address = _this.profile.addresses[0];
            }
            else {
                _this.address = {
                    id: '',
                    profile_id: _this.profile.id,
                    street: '',
                    city: '',
                    province: '',
                    country: '',
                    zip: ''
                };
            }
            if (_this.profile.contacts.length) {
                _this.contact = _this.profile.contacts[0];
            }
            else {
                _this.contact = {
                    id: '',
                    profile_id: _this.profile.id,
                    dial_code: '',
                    number: ''
                };
            }
            if (_this.profile.photo !== null) {
                _this.photo = _this.env.IMAGE_URL + 'uploads/' + _this.profile.photo;
            }
            else {
                _this.photo = _this.env.DEFAULT_IMG;
            }
            _this.loading.dismiss();
        });
    };
    ProfilePage.prototype.tapMyProfile = function () {
        this.loading.present();
        this.page = 'profile';
        this.loading.dismiss();
    };
    ProfilePage.prototype.tapMyPhoto = function () {
        this.loading.present();
        this.page = 'photo';
        this.loading.dismiss();
    };
    ProfilePage.prototype.tapMyAddress = function () {
        this.loading.present();
        this.page = 'address';
        this.loading.dismiss();
    };
    ProfilePage.prototype.tapMyContact = function () {
        this.loading.present();
        this.page = 'contact';
        this.loading.dismiss();
    };
    ProfilePage.prototype.tapUpdate = function () {
        var _this = this;
        this.loading.present();
        this.http.post(this.env.HERO_API + 'profile/modify', { user: this.user })
            .subscribe(function (data) {
            _this.storage.set('hero', data);
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () { _this.alertService.presentToast("Profile updated!"); });
        this.loading.dismiss();
    };
    ProfilePage.prototype.tapUpdateAddr = function () {
        var _this = this;
        this.loading.present();
        /*Confirm Jobs*/
        this.http.post(this.env.HERO_API + 'address/modify', { address: this.address })
            .subscribe(function (data) {
            _this.hero.data.profile.addresses[0] = _this.address;
            _this.storage.set('hero', _this.hero);
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
            console.log(error.error);
        }, function () { _this.alertService.presentToast("Address updated!"); });
        this.loading.dismiss();
    };
    ProfilePage.prototype.tapUpdateContact = function () {
        var _this = this;
        this.loading.present();
        /*Confirm Jobs*/
        this.http.post(this.env.HERO_API + 'contact/modify', { contact: this.contact })
            .subscribe(function (data) {
            _this.hero.data.profile.contacts[0] = _this.contact;
            _this.storage.set('hero', _this.hero);
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () { _this.alertService.presentToast("Contact updated!"); });
        this.loading.dismiss();
    };
    ProfilePage.prototype.loadStoredImages = function () {
        var _this = this;
        this.storage.get(STORAGE_KEY).then(function (images) {
            if (images) {
                var arr = JSON.parse(images);
                _this.images = [];
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var img = arr_1[_i];
                    var filePath = _this.file.dataDirectory + img;
                    var resPath = _this.pathForImage(filePath);
                    _this.images.push({ name: img, path: resPath, filePath: filePath });
                }
            }
        });
    };
    ProfilePage.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        else {
            var converted = this.webview.convertFileSrc(img);
            return converted;
        }
    };
    ProfilePage.prototype.createFileName = function () {
        var d = new Date(), n = d.getTime(), newFileName = n + ".jpg";
        return newFileName;
    };
    ProfilePage.prototype.selectImage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            header: "Select Image source",
                            buttons: [{
                                    text: 'Load from Library',
                                    handler: function () {
                                        _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                                    }
                                },
                                {
                                    text: 'Use Camera',
                                    handler: function () {
                                        _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                                    }
                                },
                                {
                                    text: 'Cancel',
                                    role: 'cancel'
                                }
                            ]
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
    ProfilePage.prototype.takePicture = function (sourceType) {
        var _this = this;
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imagePath) {
            if (_this.platform.is('android') && sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.filePath.resolveNativePath(imagePath)
                    .then(function (filePath) {
                    var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
                });
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
            }
        });
    };
    ProfilePage.prototype.copyFileToLocalDir = function (namePath, currentName, newFileName) {
        var _this = this;
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(function (success) {
            _this.updateStoredImages(newFileName);
        }, function (error) {
            _this.alertService.presentToast('Error while storing file.');
        });
    };
    ProfilePage.prototype.updateStoredImages = function (name) {
        var _this = this;
        this.storage.get(STORAGE_KEY).then(function (images) {
            var arr = JSON.parse(images);
            if (!arr) {
                var newImages = [name];
                _this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
            }
            else {
                arr.push(name);
                _this.storage.set(STORAGE_KEY, JSON.stringify(arr));
            }
            var filePath = _this.file.dataDirectory + name;
            var resPath = _this.pathForImage(filePath);
            var newEntry = {
                name: name,
                path: resPath,
                filePath: filePath
            };
            _this.images = [newEntry].concat(_this.images);
            _this.ref.detectChanges(); // trigger change detection cycle
        });
    };
    ProfilePage.prototype.deleteImage = function (imgEntry, position) {
        var _this = this;
        this.images.splice(position, 1);
        this.storage.get(STORAGE_KEY).then(function (images) {
            var arr = JSON.parse(images);
            var filtered = arr.filter(function (name) { return name != imgEntry.name; });
            _this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
            var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
            _this.file.removeFile(correctPath, imgEntry.name).then(function (res) {
                _this.alertService.presentToast('File removed.');
            });
        });
    };
    ProfilePage.prototype.startUpload = function (imgEntry) {
        var _this = this;
        this.photo = imgEntry.path;
        this.profile.photo = imgEntry.name;
        this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
            .then(function (entry) {
            entry.file(function (file) { return _this.readFile(file); });
        })
            .catch(function (err) {
            _this.alertService.presentToast('Error while reading file.');
        });
    };
    ProfilePage.prototype.readFile = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.onloadend = function () {
            var formData = new FormData();
            var imgBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append('file', imgBlob, file.name);
            _this.uploadImageData(formData);
        };
        reader.readAsArrayBuffer(file);
    };
    ProfilePage.prototype.uploadImageData = function (formData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                // const loading = await this.loadingController.create({
                //     content: 'Uploading image...',
                // });
                // await loading.present();
                this.loading.present();
                this.http.post(this.env.IMAGE_URL + 'upload.php', formData)
                    .pipe(finalize(function () {
                    // loading.dismiss();
                    _this.loading.dismiss();
                }))
                    .subscribe(function (res) {
                    if (res['success']) {
                        _this.alertService.presentToast('Done. Update your profile now.');
                        _this.page = 'profile';
                    }
                    else {
                        _this.alertService.presentToast('Photo not uploading.');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ProfilePage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    ProfilePage = tslib_1.__decorate([
        Component({
            selector: 'app-profile',
            templateUrl: './profile.page.html',
            styleUrls: ['./profile.page.scss'],
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
            Camera,
            File,
            WebView,
            ActionSheetController,
            ToastController,
            Platform,
            LoadingController,
            ChangeDetectorRef,
            FilePath])
    ], ProfilePage);
    return ProfilePage;
}());
export { ProfilePage };
//# sourceMappingURL=profile.page.js.map