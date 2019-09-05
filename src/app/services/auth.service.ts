import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { NavController, AlertController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false;
  token:any;
  customerId = '';
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
    }
  };

  constructor(
  	private http: HttpClient,
    private storage: Storage,
    private env: EnvService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private appVersion: AppVersion,
    private market: Market,
    public alertController: AlertController,
  ) { }

  async validateApp(email, password) {
    this.http.post(this.env.HERO_API + 'app/validate',
      {key: this.env.APP_ID}
    ).subscribe(
        data => {
          let response:any = data;
          let app:any = response.data;

          this.appVersion.getVersionNumber().then(value => {
            if(value != app.build) {
              
              this.alertService.presentToast("New update available."); 
              this.http.post(this.env.HERO_API + 'hero/login',{email: email, password: password})
              .subscribe(data => {
                  this.storage.set('hero', data);
              },error => { console.log(error); });

              this.alertUpdate(app.build);

            }
            
          }).catch(err => {
            // alert(err);
          });
           
          this.storage.set('app', response);

        },
        error => {
          this.alertService.presentToast("Invalid App Key"); 
          this.logout();
          this.navCtrl.navigateRoot('/login');
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );
  }

  async alertUpdate(version) {
    const alert = await this.alertController.create({
      header: 'New Update Available',
      message: 'Version '+version,
      buttons: [
        {
          text: 'Update',
          handler: () => {

            this.appVersion.getPackageName().then(value => {
              this.market.open(value);
            }).catch(err => {
              // alert(err);
            });

          }
        }
      ]
    });

    await alert.present();
  }

  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'hero/login',
      {email: email, password: password}
    ).pipe(
      tap(token => {
        this.storage.set('token', token)
        .then(
          () => {
            // console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );

    /*return this.http.get(this.env.API_URL + 'customers/1').subscribe((response) => {
	    console.log(response);
	});*/
  }

  register(
  		first_name: String, 
  		middle_name: String, 
  		last_name: String, 
  		 
  		street: String, 
      barangay: String, 
      city: String, 
  		province: String, 
  		country: String, 
  		zip: String, 

  		birthmonth: String, 
  		birthday: String, 
  		birthyear: String, 
      gender: String, 
  		
  		phone_number: String, 

  		email: String,
  		password: String, 
  		password_confirm: String
  		) {
    return this.http.post(this.env.API_URL + 'hero/register',
      {
      	first_name: first_name, 
      	middle_name: middle_name, 
      	last_name: last_name, 
      	 
      	street: street, 
      	barangay: barangay, 
        city: city, 
      	province: province, 
      	country: country, 
      	zip: zip, 

      	birthmonth: birthmonth, 
      	birthday: birthday, 
      	birthyear: birthyear, 
        gender: gender, 
      	phone_number: phone_number, 

      	email: email,
      	password: password,
      	password_confirm: password_confirm
      }
    )
  }

  logout() {
    this.storage.get('hero').then((val) => {
      this.account.user = val.data;
      this.account.profile = val.data.profile;

      this.account.user_id = this.account.user.id;
      this.account.app_key = this.env.APP_ID;

      this.http.post(this.env.HERO_API + 'account_settings/byUser', { user_id: this.account.user.id, app_key: this.env.APP_ID })
        .subscribe(data => { 
          // this.storage.set('hero', data);
          let response:any = data;
          console.log(response);
          this.account.settings = JSON.parse(response.data.settings);
          this.account.settings.offline = true;

          this.http.post(this.env.HERO_API + 'account_settings/save', { user_id: this.account.user.id, app_key: this.env.APP_ID, settings: JSON.stringify(this.account.settings) })
            .subscribe(data => { 
              let response:any = data;
              this.account.settings = JSON.parse(response.data.settings);
              this.account.id = response.data.id;
            },error => { 
              this.alertService.presentToast("Server not responding!");
              console.log(error);
            },() => { 
          });  

          this.account.id = response.data.id;
          // console.log(this.account.settings);
        },error => { 
          this.account.settings.offline = true;
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
    });    
    this.storage.remove("token");
    this.storage.remove("hero");
    this.isLoggedIn = false;
    delete this.token;
    return '';
  }

  user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'customers/1', { headers: headers })
    .pipe(
      tap(user => {
        return user;
      })
    )
  }

  getToken() {
    return this.storage.get('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
}
