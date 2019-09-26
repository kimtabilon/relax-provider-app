import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
import { User } from '../models/user';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { NetworkPage } from '../network/network.page';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class InitService {

  constructor(
  	private http: HttpClient,
    private storage: Storage,
    private env: EnvService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private authService: AuthService,
    private appVersion: AppVersion,
    private market: Market,
    public alertController: AlertController,
    public modalController: ModalController,
  ) { }

  checkNetwork() {
    console.log('check network');
    this.http
    .post(this.env.HERO_API + 'check/server',{})
    .subscribe(
       data => { 
         this.checkAppUpdate(); 
       },
       error => { 
         this.networkError(error); 
       }
    );
  }

  checkAppUpdate() {
    this.http.post(this.env.HERO_API + 'app/validate',
      {key: this.env.APP_ID}
    ).subscribe(
      data => {
        let response:any = data;
        let app:any = response.data;

        this.appVersion.getVersionNumber().then(value => {
          if(value != app.build) {
            this.alertUpdate(app.build);
          }
          
        }).catch(err => {
          // alert(err);
        });
         
        this.storage.set('app', response);

      },
      error => {
        this.alertService.presentToast("App registration key is invalid. Or App was disabled in the server."); 
        this.authService.logout();
        this.navCtrl.navigateRoot('/login'); 
      },
      () => {
        // this.navCtrl.navigateRoot('/tabs/service');
      }
    );
  }

  async networkError(error) {

    const modal = await this.modalController.create({
      component: NetworkPage,
      componentProps: { 
        error: {error}
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        this.checkNetwork();
        let response:any = data;
    });

    return await modal.present();
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
}
