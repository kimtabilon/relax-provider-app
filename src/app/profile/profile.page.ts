import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuController, NavController, ActionSheetController, ToastController, Platform, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';

import { SchedulePage } from '../schedule/schedule.page';
import { OrderPipe } from 'ngx-order-pipe';
import { IonicSelectableComponent } from 'ionic-selectable';
 
const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  hero:any = [];

  account:any = {
    id: '',
    user_id: '',
    app_key: '',
    settings: {
      offline: false,
      auto_confirm: false,
      account_lock: true,
      preferred_location: [], 
      block_dates: []
    },
    user: {
      id:'',
      email: '',
      password: '',
      status: ''
    },
    profile: {
      id:'',
      first_name: '',
      middle_name: '',
      last_name: '',
      birthday: '',
      gender: '',
      photo: ''
    },
    contact: {
      id: '',
      profile_id: '',
      dial_code: '',
      number: ''
    },
    address: {
      id: '',
      profile_id: '',
      street: '',
      barangay: '',
      city: '',
      province: '',
      country: '',
      zip: ''
    }
  };

	photo:any = '';
  page:any = 'profile';

  preferredCities:any = [];
  province:any = [];
  images = [];

  provinces:any = [];
  cities:any = [];
  barangays:any = [];
  reviews:any = [];

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public activatedRoute : ActivatedRoute,
    public loading: LoadingService,
    private http: HttpClient,
    private env: EnvService,

    private camera: Camera, 
    private file: File, 
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private toastController: ToastController,
    private platform: Platform, 
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef, 
    private filePath: FilePath,
    public modalController: ModalController,
    public alertController: AlertController,
    private orderPipe: OrderPipe
  ) { }

  ngOnInit() {
  	this.platform.ready().then(() => {
      this.loadStoredImages();
    });
  }

  doRefresh(event) {
    this.http.post(this.env.HERO_API + 'hero/login',{email: this.account.user.email, password:  this.account.user.password})
    .subscribe(data => {
        let response:any = data;
        this.storage.set('hero', response);
        // this.user = response.data;
        this.ionViewWillEnter();
    },error => { 
      this.logout();
      console.log(error); 
    });
    
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SchedulePage,
      componentProps: { block_dates: this.account.settings.block_dates }
    });

    modal.onDidDismiss()
      .then((data) => {
        // const user = data['data']; // Here's your selected user!
        let response:any = data;
        this.account.settings.block_dates = response.data.block_dates;
        this.saveSettings();
    });

    return await modal.present();
  }

  ionViewWillEnter() {
    this.loading.present();
    this.storage.get('hero').then((val) => {
      this.hero = val;
      this.account.user = val.data;
      this.account.profile = val.data.profile;

      this.account.user_id = this.account.user.id;
      this.account.app_key = this.env.APP_ID;

      if(this.account.profile.addresses.length) {
        this.account.address = this.account.profile.addresses[0];
      } else {
        this.account.address = {
          id: '',
          profile_id: this.account.profile.id,
          street: '',
          barangay: '',
          city: '',
          province: '',
          country: '',
          zip: ''
        };
      }

      if(this.account.profile.contacts.length) {
        this.account.contact = this.account.profile.contacts[0];
      } else {
        this.account.contact = {
          id: '',
          profile_id: this.account.profile.id,
          dial_code: '',
          number: ''
        };
      }

      if(this.account.profile.photo!==null) {
      	this.photo = this.env.IMAGE_URL + 'uploads/' + this.account.profile.photo;
      } else {
      	this.photo = this.env.DEFAULT_IMG;
      }

      this.http.post(this.env.HERO_API + 'account_settings/byUser', { user_id: this.account.user.id, app_key: this.env.APP_ID })
        .subscribe(data => { 
          // this.storage.set('hero', data);
          let response:any = data;
          this.account.settings = JSON.parse(response.data.settings);
          this.account.id = response.data.id;
          // console.log(this.account.settings);
        },error => { 
          let settings:any = JSON.stringify(this.account.settings);
          this.http.post(this.env.HERO_API + 'account_settings/save', { user_id: this.account.user.id, app_key: this.env.APP_ID, settings: settings })
            .subscribe(data => { 
              let response:any = data;
              this.account.settings = JSON.parse(response.data.settings);
              this.account.id = response.data.id;
            },error => { 
              this.alertService.presentToast("Server not responding!");
              console.log(error);
            },() => { 
          });  
        },() => { 
          // this.alertService.presentToast("Settings saved."); 
      }); 

      fetch('./assets/json/refprovince.json').then(res => res.json())
      .then(json => {
        // console.log(json.RECORDS);
        let records:any = json.RECORDS
        let province:any = records.filter(item => item.provDesc === this.account.address.province)[0];
        this.provinces = this.orderPipe.transform(records, 'provDesc'); 
        
        fetch('./assets/json/refcitymun.json').then(res => res.json())
        .then(json => {
          // console.log(json.RECORDS);
          let records:any = json.RECORDS
          let city:any = records.filter(item => item.citymunDesc === this.account.address.city)[0];
          this.cities = records.filter(item => item.provCode === province.provCode);
          this.cities = this.orderPipe.transform(this.cities, 'citymunDesc');

          fetch('./assets/json/refbrgy.json').then(res => res.json())
          .then(json => {
            let records:any = json.RECORDS
            this.barangays = records.filter(item => item.citymunCode === city.citymunCode);
            this.barangays = this.orderPipe.transform(this.barangays, 'brgyDesc');
          });
        });
      });

      this.loading.dismiss();
    });

  }

  tapProvince(event){ 
    let prov:any = event.detail.value;
    fetch('./assets/json/refprovince.json').then(res => res.json())
    .then(json => {
      let records:any = json.RECORDS
      let province:any = records.filter(item => item.provDesc === prov)[0];
      fetch('./assets/json/refcitymun.json').then(res => res.json())
      .then(json => {
        let records:any = json.RECORDS
        this.cities = records.filter(item => item.provCode === province.provCode);
        this.cities = this.orderPipe.transform(this.cities, 'citymunDesc');
      });
    });
  };

  tapCity(event){ 
    let ci:any = event.detail.value;
    fetch('./assets/json/refcitymun.json').then(res => res.json())
    .then(json => {
      let records:any = json.RECORDS
      let city:any = records.filter(item => item.citymunDesc === ci)[0];

      fetch('./assets/json/refbrgy.json').then(res => res.json())
      .then(json => {
        let records:any = json.RECORDS
        this.barangays = records.filter(item => item.citymunCode === city.citymunCode);
        this.barangays = this.orderPipe.transform(this.barangays, 'brgyDesc');
      });
    });
  };

  tapBarangay(event){ 
    
  };

  savePreferredLocation() {
    // console.log(this.account.settings.preferred_location);
    this.loading.present();
    let settings:any = JSON.stringify(this.account.settings);
    this.http.post(this.env.HERO_API + 'account_settings/save', { user_id: this.account.user.id, app_key: this.env.APP_ID, settings: settings })
      .subscribe(data => { 
        this.loading.dismiss();
      },error => { 
        this.alertService.presentToast("Server not responding!");
        console.log(error);
        this.loading.dismiss();
      },() => { 
        // this.alertService.presentToast("Settings Saved"); 
    });  
  }

  saveSettings(){
    this.loading.present();
    let settings:any = JSON.stringify(this.account.settings);
    console.log('Saving...');
    this.http.post(this.env.HERO_API + 'account_settings/save', { user_id: this.account.user.id, app_key: this.env.APP_ID, settings: settings })
      .subscribe(data => { 
        let response:any = data;
        this.account.settings = JSON.parse(response.data.settings);
        this.account.id = response.data.id;
        this.loading.dismiss();
        console.log('DONE');
      },error => { 
        this.alertService.presentToast("Server not responding!");
        console.log(error);
        this.loading.dismiss();
      },() => { 
        // this.alertService.presentToast("Settings Saved"); 
    });  
    // console.log(this.account);
  }

  segmentChanged(ev: any) {
    switch (ev.detail.value) {
      case "profile":
        this.loading.present();
        this.page='profile';
        this.loading.dismiss();
        break;

      case "settings":
        this.loading.present();

        fetch('./assets/json/refprovince.json').then(res => res.json())
        .then(json => {
          let records:any = json.RECORDS
          this.province = records.filter(item => item.provDesc === this.account.address.province);
        });

        fetch('./assets/json/refcitymun.json').then(res => res.json())
        .then(json => {
          let records:any = json.RECORDS
          this.preferredCities = records.filter(item => item.provCode === this.province[0].provCode);
          this.preferredCities = this.orderPipe.transform(this.preferredCities, 'provDesc');
          // console.log(this.cities);
        });

        this.page='settings';
        this.loading.dismiss();
        break;

      case "logs":
        this.loading.present();
        this.page='logs';
        this.loading.dismiss();
        break;

      case "reviews":
        this.loading.present();

        this.http.post(this.env.HERO_API + 'reviews/byProvider',{ hero_id: this.account.user.id })
          .subscribe(data => {
            let response:any = data; 
            this.reviews = response.data;
          },error => { this.alertService.presentToast("Somethings went wrong");
        },() => { });  
        
        this.page='reviews';
        this.loading.dismiss();
        break;
      
      default:
        // code...
        break;
    }
  }

  tapUpdate() {
    this.loading.present();
    this.http.post(this.env.HERO_API + 'profile/modify',{ user: this.account.user })
      .subscribe(data => { 
      	this.storage.set('hero', data);
      },error => { this.alertService.presentToast("Server not responding!");
    },() => { this.alertService.presentToast("Profile updated!"); });  

    this.loading.dismiss();
  }

  parse(customer_info) {
    return JSON.parse(customer_info);
  }

  async tapUpdateAccount() {
    const alert = await this.alertController.create({
      header: 'Send updated account information?',
      message: 'Admin will review your changes. If you continue, you will not be able to edit your information.',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');

          }
        }, {
          text: 'Continue',
          handler: () => {
            this.loading.present();

            let account:any = JSON.parse(JSON.stringify(this.account));
            let inbox:any = {};

            delete account.profile.addresses;
            delete account.profile.contacts;
            delete account.user.profile;
            delete account.settings;

            delete account.profile.created_at;
            delete account.profile.deleted_at;
            delete account.profile.updated_at;

            delete account.address.profile_id;
            delete account.address.created_at;
            delete account.address.deleted_at;
            delete account.address.updated_at;

            delete account.contact.profile_id;
            delete account.contact.created_at;
            delete account.contact.deleted_at;
            delete account.contact.updated_at;

            delete account.user.profile_id;
            delete account.user.created_at;
            delete account.user.deleted_at;
            delete account.user.updated_at;

            inbox.user_id = account.user_id;
            inbox.app_key = account.app_key;
            inbox.data = JSON.stringify({
              hero: account.user,
              profile: account.profile,
              address: account.address,
              contact: account.contact,
            });

            inbox.request = 'Request for account update.';
            inbox.type = 'Update Account';
            inbox.link = '<ul><li><a href="'+this.env.HERO_ADMIN + 'profiles/'+account.profile.id+'/edit" target="_blank">Goto Profile</a></li>' +
                         '<li><a href="'+this.env.HERO_ADMIN + 'heroes/'+account.user.id+'/edit" target="_blank">Goto Hero</a></li>' +
                         '<li><a href="'+this.env.HERO_ADMIN + 'addresses/'+account.address.id+'/edit" target="_blank">Goto Address</a></li>' +
                         '<li><a href="'+this.env.HERO_ADMIN + 'contacts/'+account.contact.id+'/edit" target="_blank">Goto Contact</a></li></ul>';


            this.http.post(this.env.HERO_API + 'admin_inboxes/save', inbox)
              .subscribe(data => { 
                // this.storage.set('hero', data);
              },error => { 
                this.alertService.presentToast("Server not responding!");
                console.log(error);
              },() => { 
                this.alertService.presentToast("Request Sent. Edit Lock."); 
            }); 

            this.account.settings.account_lock = true;
            let settings:any = JSON.stringify(this.account.settings);
            this.http.post(this.env.HERO_API + 'account_settings/save', { user_id: this.account.user.id, app_key: this.env.APP_ID, settings: settings })
              .subscribe(data => { 
                let response:any = data;
                this.account.settings = JSON.parse(response.data.settings);
                this.account.id = response.data.id;
              },error => { 
                this.alertService.presentToast("Server not responding!");
                console.log(error);
              },() => { 
                // this.alertService.presentToast("Account"); 
            });  

            this.loading.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  tapUpdateAddr() {
    this.loading.present();

    /*Confirm Jobs*/
    this.http.post(this.env.HERO_API + 'address/modify',{ address: this.account.address })
      .subscribe(data => { 
        this.hero.data.profile.addresses[0] = this.account.address;
        this.storage.set('hero', this.hero);
      },error => { 
        this.alertService.presentToast("Server not responding!");
        console.log(error.error);
    },() => { this.alertService.presentToast("Address updated!"); });  

    this.loading.dismiss();
  }

  tapUpdateContact() {
    this.loading.present();

    /*Confirm Jobs*/
    this.http.post(this.env.HERO_API + 'contact/modify',{ contact: this.account.contact })
      .subscribe(data => { 
        this.hero.data.profile.contacts[0] = this.account.contact;
        this.storage.set('hero', this.hero);
      },error => { this.alertService.presentToast("Server not responding!");
    },() => { this.alertService.presentToast("Contact updated!"); });  

    this.loading.dismiss();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Request access?',
      message: 'Wait for admin confirmation to access and modify your account information.',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Send Request',
          handler: () => {
            // console.log('Confirm Okay');
            let request:any = 'Hero Requesting access to edit account information.';
            let link:any = '<a href="'+this.env.HERO_ADMIN + 'accountSettings/'+this.account.id+'/edit" target="_blank">Goto Account Setting</a>';


            this.http.post(this.env.HERO_API + 'admin_inboxes/save', { request: request, link: link, type: 'Unlock Account', data: '' })
              .subscribe(data => { 
                // this.storage.set('hero', data);
              },error => { 
                this.alertService.presentToast("Server not responding!");
                console.log(error);
              },() => { 
                this.alertService.presentToast("Request Sent"); 
            }); 
          }
        }
      ]
    });

    await alert.present();
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }
 
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
	}

	async selectImage() {
	    const actionSheet = await this.actionSheetController.create({
	        header: "Select Image source",
	        buttons: [{
	                text: 'Load from Library',
	                handler: () => {
	                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
	                }
	            },
	            {
	                text: 'Use Camera',
	                handler: () => {
	                    this.takePicture(this.camera.PictureSourceType.CAMERA);
	                }
	            },
	            {
	                text: 'Cancel',
	                role: 'cancel'
	            }
	        ]
	    });
	    await actionSheet.present();
	}
	 
	takePicture(sourceType: PictureSourceType) {
	    var options: CameraOptions = {
	        quality: 100,
	        sourceType: sourceType,
	        saveToPhotoAlbum: false,
	        correctOrientation: true
	    };
	 
	    this.camera.getPicture(options).then(imagePath => {
	        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	            this.filePath.resolveNativePath(imagePath)
	                .then(filePath => {
	                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
	                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
	                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	                });
	        } else {
	            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
	            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
	            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	        }
	    });
	 
	}
	 
	copyFileToLocalDir(namePath, currentName, newFileName) {
	    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
	        this.updateStoredImages(newFileName);
	    }, error => {
	        this.alertService.presentToast('Error while storing file.');
	    });
	}
	 
	updateStoredImages(name) {
	    this.storage.get(STORAGE_KEY).then(images => {
	        let arr = JSON.parse(images);
	        if (!arr) {
	            let newImages = [name];
	            this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
	        } else {
	            arr.push(name);
	            this.storage.set(STORAGE_KEY, JSON.stringify(arr));
	        }
	 
	        let filePath = this.file.dataDirectory + name;
	        let resPath = this.pathForImage(filePath);
	 
	        let newEntry = {
	            name: name,
	            path: resPath,
	            filePath: filePath
	        };

	 
	        this.images = [newEntry, this.images];
	        this.ref.detectChanges(); // trigger change detection cycle
	    });
	} 

	deleteImage(imgEntry, position) {
    this.images.splice(position, 1);
 
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
 
        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
 
        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.alertService.presentToast('File removed.');
        });
    });
	}	

	startUpload(imgEntry) {
			// this.photo = imgEntry.path;
			this.account.profile.photo = imgEntry.name;
	    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
	        .then(entry => {
	            ( < FileEntry > entry).file(file => this.readFile(file));
	        })
	        .catch(err => {
	            this.alertService.presentToast('Error while reading file.');
	        });
	}
	 
	readFile(file: any) {
	    const reader = new FileReader();
	    reader.onloadend = () => {
	        const formData = new FormData();
	        const imgBlob = new Blob([reader.result], {
	            type: file.type
	        });
	        formData.append('file', imgBlob, file.name);
	        this.uploadImageData(formData);
	    };
	    reader.readAsArrayBuffer(file);
	}
	 
	async uploadImageData(formData: FormData) {
	    // const loading = await this.loadingController.create({
	    //     content: 'Uploading image...',
	    // });
	    // await loading.present();

	    this.loading.present();
	 
	    this.http.post(this.env.IMAGE_URL + 'upload.php', formData)
	        .pipe(
	            finalize(() => {
	                // loading.dismiss();
	                this.loading.dismiss();
	            })
	        )
	        .subscribe(res => {
	            if (res['success']) {
	                this.alertService.presentToast('Done. Update your profile now.')
                  this.page = 'profile';
	            } else {
	                this.alertService.presentToast('Photo not uploading.')
	            }
	        });
	}

  logout() {
    this.loading.present();
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
    this.loading.dismiss();
  }

}
